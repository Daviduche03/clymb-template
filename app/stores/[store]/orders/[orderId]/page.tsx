import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/db"
import * as schema from "@/db/schema/stores"
import { eq } from "drizzle-orm"
import { OrderOne, type OrderProps } from "@/components/commercn/orders/order-01"
import { Button } from "@/components/ui/button"

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ store: string; orderId: string }>
}) {
  const { store: storeId, orderId } = await params

  // 1. Fetch order details
  const orderResult = await db.query.orders.findFirst({
    where: eq(schema.orders.id, orderId),
  })

  if (!orderResult) notFound()

  // 2. Fetch order items
  const itemsResult = await db.query.orderItems.findMany({
    where: eq(schema.orderItems.orderId, orderId),
  })

  // 3. To get images for items, we could do a join, or just fetch the products
  // For simplicity, let's fetch all store products to map images
  const products = await db.query.storeProducts.findMany({
    where: eq(schema.storeProducts.storeId, orderResult.storeId),
  })
  
  const productImages: Record<string, string> = {}
  for (const p of products) {
    productImages[p.id] = p.image || ""
  }

  const orderProps: OrderProps = {
    orderNumber: orderResult.orderNumber,
    status: orderResult.status,
    orderDate: orderResult.createdAt.toDateString(),
    estimatedDelivery: new Date(orderResult.createdAt.getTime() + 4 * 24 * 60 * 60 * 1000).toDateString(), // +4 days
    items: itemsResult.map((item) => ({
      id: item.id,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      image: item.productId ? (productImages[item.productId] || "") : "",
    })),
    payment: {
      method: "Credit Card (Mock)",
      total: orderResult.total,
    },
  }

  return (
    <main className="bg-background min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8 flex flex-col items-center">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for your purchase. We&apos;ve received your order and will begin processing it right away.
          </p>
        </div>

        <OrderOne order={orderProps} />

        <div className="pt-8">
          <Button asChild size="lg" variant="outline">
            <Link href={`/stores/${storeId}`}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
