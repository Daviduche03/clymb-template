import { notFound } from "next/navigation"
import { CartPageClient } from "@/components/storefront/cart-page-client"
import { getDefaultStore } from "@/lib/api/stores"

export default async function CartPage() {
  const store = await getDefaultStore()

  if (!store) notFound()

  return <CartPageClient store={store} basePath="" />
}
