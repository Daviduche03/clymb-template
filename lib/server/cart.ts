import { and, eq, inArray, sql } from "drizzle-orm"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import { db } from "@/db"
import * as schema from "@/db/schema/stores"

export type ServerCartSnapshot = {
  id: string
  storeId: string
  sessionToken: string
  status: string
  currency: string
  customerEmail: string | null
  items: ShoppingCartLine[]
}

function normalizeQuantity(quantity: number) {
  const normalized = Math.floor(Number(quantity))
  if (!Number.isFinite(normalized) || normalized < 1) {
    throw new Error("Cart quantity must be a positive integer.")
  }
  return normalized
}

export async function getOrCreateCart(storeSlug: string, sessionToken: string) {
  const store = await db.query.stores.findFirst({
    where: eq(schema.stores.slug, storeSlug),
  })

  if (!store) {
    throw new Error("Store not found.")
  }

  const existing = await db.query.carts.findFirst({
    where: eq(schema.carts.sessionToken, sessionToken),
  })

  if (existing) {
    return existing
  }

  const [created] = await db
    .insert(schema.carts)
    .values({
      storeId: store.id,
      sessionToken,
      status: "active",
      currency: "$",
    })
    .returning()

  return created
}

export async function addLineToCart({
  storeSlug,
  sessionToken,
  productSlug,
  quantity,
  variantId,
  variantTitle,
}: {
  storeSlug: string
  sessionToken: string
  productSlug: string
  quantity: number
  variantId?: string
  variantTitle?: string
}) {
  const cart = await getOrCreateCart(storeSlug, sessionToken)
  const normalizedQuantity = normalizeQuantity(quantity)

  const product = await db.query.storeProducts.findFirst({
    where: and(
      eq(schema.storeProducts.storeId, cart.storeId),
      eq(schema.storeProducts.slug, productSlug),
      eq(schema.storeProducts.active, true),
    ),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  const variants = await db.query.productVariants.findMany({
    where: eq(schema.productVariants.productId, product.id),
  })

  const normalizedVariantTitle = variantTitle?.trim().toLowerCase()
  const selectedVariant = variantId
    ? variants.find((variant) => variant.id === variantId && variant.active)
    : normalizedVariantTitle
      ? variants.find(
          (variant) => variant.active && variant.title.trim().toLowerCase() === normalizedVariantTitle,
        )
      : variants.find((variant) => variant.active)

  if (!selectedVariant) {
    throw new Error("Variant not found.")
  }

  await db
    .insert(schema.cartItems)
    .values({
      cartId: cart.id,
      productId: product.id,
      variantId: selectedVariant.id,
      quantity: normalizedQuantity,
      unitPriceSnapshot: selectedVariant.price,
      currency: selectedVariant.currency,
    })
    .onConflictDoUpdate({
      target: [schema.cartItems.cartId, schema.cartItems.variantId],
      set: {
        quantity: sql`${schema.cartItems.quantity} + ${normalizedQuantity}`,
        unitPriceSnapshot: selectedVariant.price,
        currency: selectedVariant.currency,
        updatedAt: sql`now()`,
      },
    })

  return getCartSnapshot(sessionToken)
}

export async function setCartLineQuantity({
  sessionToken,
  variantId,
  quantity,
}: {
  sessionToken: string
  variantId: string
  quantity: number
}) {
  const cart = await db.query.carts.findFirst({
    where: eq(schema.carts.sessionToken, sessionToken),
  })

  if (!cart) {
    throw new Error("Cart not found.")
  }

  const normalizedQuantity = Math.floor(Number(quantity))
  if (!Number.isFinite(normalizedQuantity)) {
    throw new Error("Invalid quantity.")
  }

  if (normalizedQuantity < 1) {
    await db.delete(schema.cartItems).where(
      and(
        eq(schema.cartItems.cartId, cart.id),
        eq(schema.cartItems.variantId, variantId),
      ),
    )
  } else {
    await db
      .update(schema.cartItems)
      .set({
        quantity: normalizedQuantity,
        updatedAt: sql`now()`,
      })
      .where(
        and(
          eq(schema.cartItems.cartId, cart.id),
          eq(schema.cartItems.variantId, variantId),
        ),
      )
  }

  return getCartSnapshot(sessionToken)
}

export async function getCartSnapshot(sessionToken: string): Promise<ServerCartSnapshot | null> {
  const cart = await db.query.carts.findFirst({
    where: eq(schema.carts.sessionToken, sessionToken),
  })

  if (!cart) {
    return null
  }

  const items = await db.query.cartItems.findMany({
    where: eq(schema.cartItems.cartId, cart.id),
  })

  const productIds = [...new Set(items.map((item) => item.productId))]
  const variantIds = [...new Set(items.map((item) => item.variantId))]

  const [products, variants] = await Promise.all([
    productIds.length > 0
      ? db.query.storeProducts.findMany({
          where: inArray(schema.storeProducts.id, productIds),
        })
      : Promise.resolve([]),
    variantIds.length > 0
      ? db.query.productVariants.findMany({
          where: inArray(schema.productVariants.id, variantIds),
        })
      : Promise.resolve([]),
  ])

  const productsById = new Map(products.map((product) => [product.id, product]))
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]))

  return {
    id: cart.id,
    storeId: cart.storeId,
    sessionToken: cart.sessionToken,
    status: cart.status,
    currency: cart.currency,
    customerEmail: cart.customerEmail,
    items: items.map((item) => {
      const product = productsById.get(item.productId)
      const variant = variantsById.get(item.variantId)

      return {
        id: product?.slug ?? item.productId,
        name: product?.name ?? "Unknown product",
        category:
          product?.category
            ? `${product.category}${variant?.title && variant.title !== "Default" ? ` · ${variant.title}` : ""}`
            : variant?.title ?? "Item",
        image: product?.image ?? "",
        price: item.unitPriceSnapshot,
        quantity: item.quantity,
        variantId: item.variantId ?? undefined,
        sku: variant?.sku ?? undefined,
        variantTitle: variant?.title ?? undefined,
        currency: item.currency,
      }
    }),
  }
}
