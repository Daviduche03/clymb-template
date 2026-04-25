"use server";

import { eq, inArray } from "drizzle-orm";
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01";

export async function submitOrder({
  storeSlug,
  lines,
  customerEmail,
}: {
  storeSlug: string;
  lines: ShoppingCartLine[];
  customerEmail: string;
}) {
  try {
    const [{ db }, schema] = await Promise.all([import("@/db"), import("@/db/schema/stores")]);

    if (lines.length === 0) {
      throw new Error("Cart is empty");
    }

    const store = await db.query.stores.findFirst({
      where: eq(schema.stores.slug, storeSlug),
    });

    if (!store) {
      throw new Error("Store not found");
    }

    const slugs = lines.map((line) => line.id);
    const products = await db.query.storeProducts.findMany({
      where: inArray(schema.storeProducts.slug, slugs),
    });

    const productsBySlug = new Map(products.map((product) => [product.slug, product]));

    const normalizedLines = lines.map((line) => {
      const product = productsBySlug.get(line.id);

      if (!product || product.storeId !== store.id) {
        throw new Error(`Product "${line.id}" is not available in this store`);
      }

      const unitPrice = product.salePrice ?? product.price;

      return {
        orderProduct: product,
        quantity: line.quantity,
        productName: product.name,
        unitPrice,
      };
    });

    const computedTotal = normalizedLines.reduce(
      (sum, line) => sum + line.unitPrice * line.quantity,
      0,
    );

    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const [newOrder] = await db.insert(schema.orders).values({
      storeId: store.id,
      orderNumber,
      status: "Processing",
      total: computedTotal,
      customerEmail,
    }).returning({ id: schema.orders.id });

    const itemsToInsert = normalizedLines.map((line) => ({
      orderId: newOrder.id,
      productId: line.orderProduct.id,
      productName: line.productName,
      quantity: line.quantity,
      price: line.unitPrice,
    }));

    if (itemsToInsert.length > 0) {
      await db.insert(schema.orderItems).values(itemsToInsert);
    }

    return { success: true, orderId: newOrder.id };
  } catch (error) {
    console.error("Failed to submit order:", error);
    return { success: false, error: "Failed to process checkout." };
  }
}
