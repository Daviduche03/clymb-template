import { notFound } from "next/navigation"
import { CartPageClient } from "@/components/storefront/cart-page-client"
import { getStoreBySlug } from "@/lib/api/stores"

export default async function StoreCartPage({
  params,
}: {
  params: Promise<{ store: string }>
}) {
  const { store: storeId } = await params
  const store = await getStoreBySlug(storeId)

  if (!store) notFound()

  return <CartPageClient store={store} basePath={`/stores/${store.id}`} />
}
