"use server"

import { and, eq, gte, inArray, sql } from "drizzle-orm"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"

type CheckoutCartLine = ShoppingCartLine & {
  variantId?: string
  sku?: string
  currency?: string
}

type SubmitOrderInput = {
  storeSlug: string
  lines: CheckoutCartLine[]
  customerEmail: string
  shippingAddress?: string
  idempotencyKey?: string
}

type NormalizedCheckoutLine = {
  slug: string
  quantity: number
  line: CheckoutCartLine
}

function normalizeCheckoutLines(lines: CheckoutCartLine[]): NormalizedCheckoutLine[] {
  const grouped = new Map<string, NormalizedCheckoutLine>()

  for (const line of lines) {
    const quantity = Math.floor(Number(line.quantity))
    if (!line.id || !Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Cart contains an invalid quantity.")
    }

    const aggregationKey = `${line.id}:${line.variantId ?? "default"}`
    const existing = grouped.get(aggregationKey)

    if (existing) {
      existing.quantity += quantity
      continue
    }

    grouped.set(aggregationKey, {
      slug: line.id,
      quantity,
      line,
    })
  }

  return [...grouped.values()]
}

function generateOrderNumber() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()
  const suffix = Date.now().toString().slice(-6)
  return `ORD-${random}-${suffix}`
}

function generateSessionToken(prefix: string) {
  const random = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now()}-${random}`
}

export async function submitOrder({
  storeSlug,
  lines,
  customerEmail,
  shippingAddress,
  idempotencyKey,
}: SubmitOrderInput) {
  try {
    const [{ db }, schema] = await Promise.all([import("@/db"), import("@/db/schema/stores")])

    const normalizedLines = normalizeCheckoutLines(lines)
    if (normalizedLines.length === 0) {
      throw new Error("Cart is empty.")
    }

    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, storeSlug),
    })

    if (!store) {
      throw new Error("Store not found.")
    }

    if (idempotencyKey) {
      const existingOrder = await db.query.orders.findFirst({
        where: and(
          eq(schema.orders.storeId, store.id),
          eq(schema.orders.idempotencyKey, idempotencyKey),
        ),
      })

      if (existingOrder) {
        return { success: true, orderId: existingOrder.id, reused: true }
      }
    }

    const productSlugs = [...new Set(normalizedLines.map((line) => line.slug))]
    const products = await db.query.storeProducts.findMany({
      where: and(
        eq(schema.storeProducts.storeId, store.id),
        inArray(schema.storeProducts.slug, productSlugs),
      ),
    })

    const productsBySlug = new Map(products.map((product) => [product.slug, product]))
    const variants = await db.query.productVariants.findMany({
      where: inArray(
        schema.productVariants.productId,
        products.map((product) => product.id),
      ),
    })

    const variantsByProductId = new Map<string, typeof variants>()
    const variantsById = new Map(variants.map((variant) => [variant.id, variant]))

    for (const variant of variants) {
      const current = variantsByProductId.get(variant.productId) ?? []
      current.push(variant)
      variantsByProductId.set(variant.productId, current)
    }

    const checkoutLines = normalizedLines.map((line) => {
      const product = productsBySlug.get(line.slug)
      if (!product || !product.active) {
        throw new Error(`Product "${line.slug}" is not available in this store.`)
      }

      const productVariants = variantsByProductId.get(product.id) ?? []
      const selectedVariant = line.line.variantId
        ? variantsById.get(line.line.variantId)
        : productVariants.find((variant) => variant.active) ?? null

      if (!selectedVariant || selectedVariant.productId !== product.id || !selectedVariant.active) {
        throw new Error(`A sellable variant for "${product.name}" could not be found.`)
      }

      return {
        product,
        variant: selectedVariant,
        quantity: line.quantity,
        unitPrice: selectedVariant.price,
        currency: selectedVariant.currency || product.currency || "$",
      }
    })

    const productQuantityById = new Map<string, number>()
    for (const line of checkoutLines) {
      productQuantityById.set(
        line.product.id,
        (productQuantityById.get(line.product.id) ?? 0) + line.quantity,
      )
    }

    const subtotal = checkoutLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    )
    const currency = checkoutLines[0]?.currency ?? "$"

    const createdOrder = await db.transaction(async (tx) => {
      if (idempotencyKey) {
        const duplicate = await tx.query.orders.findFirst({
          where: and(
            eq(schema.orders.storeId, store.id),
            eq(schema.orders.idempotencyKey, idempotencyKey),
          ),
        })

        if (duplicate) {
          return duplicate
        }
      }

      for (const line of checkoutLines) {
        const variantUpdate = await tx
          .update(schema.productVariants)
          .set({
            inventory: sql`${schema.productVariants.inventory} - ${line.quantity}`,
            updatedAt: sql`now()`,
          })
          .where(
            and(
              eq(schema.productVariants.id, line.variant.id),
              eq(schema.productVariants.active, true),
              gte(schema.productVariants.inventory, line.quantity),
            ),
          )
          .returning({ id: schema.productVariants.id })

        if (variantUpdate.length === 0) {
          throw new Error(`Insufficient stock for "${line.product.name}".`)
        }
      }

      for (const [productId, quantity] of productQuantityById.entries()) {
        const productUpdate = await tx
          .update(schema.storeProducts)
          .set({
            inventory: sql`${schema.storeProducts.inventory} - ${quantity}`,
            updatedAt: sql`now()`,
          })
          .where(
            and(
              eq(schema.storeProducts.id, productId),
              eq(schema.storeProducts.active, true),
              gte(schema.storeProducts.inventory, quantity),
            ),
          )
          .returning({ id: schema.storeProducts.id })

        if (productUpdate.length === 0) {
          throw new Error("Inventory changed while this order was being processed. Please refresh and try again.")
        }
      }

      const [cart] = await tx
        .insert(schema.carts)
        .values({
          storeId: store.id,
          sessionToken: generateSessionToken(idempotencyKey ?? "checkout"),
          status: "converted",
          currency,
          customerEmail,
        })
        .returning({ id: schema.carts.id })

      await tx.insert(schema.cartItems).values(
        checkoutLines.map((line) => ({
          cartId: cart.id,
          productId: line.product.id,
          variantId: line.variant.id,
          quantity: line.quantity,
          unitPriceSnapshot: line.unitPrice,
          currency: line.currency,
        })),
      )

      const [newOrder] = await tx
        .insert(schema.orders)
        .values({
          storeId: store.id,
          cartId: cart.id,
          orderNumber: generateOrderNumber(),
          status: "processing",
          paymentStatus: "paid",
          subtotal,
          total: subtotal,
          currency,
          customerEmail,
          shippingAddress,
          idempotencyKey: idempotencyKey ?? null,
        })
        .returning()

      await tx.insert(schema.orderItems).values(
        checkoutLines.map((line) => ({
          orderId: newOrder.id,
          productId: line.product.id,
          variantId: line.variant.id,
          productName: line.product.name,
          variantTitle: line.variant.title,
          variantSku: line.variant.sku,
          quantity: line.quantity,
          price: line.unitPrice,
          currency: line.currency,
        })),
      )

      return newOrder
    })

    return { success: true, orderId: createdOrder.id, reused: false }
  } catch (error) {
    console.error("Failed to submit order:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process checkout.",
    }
  }
}
