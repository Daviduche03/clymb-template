import { notFound } from "next/navigation"
import { StorefrontPage } from "@/components/storefront/storefront-page"
import { getStoreBySlug } from "@/lib/api/stores"

export default async function StorePage({
  params,
}: {
  params: Promise<{ store: string }>
}) {
  const { store: storeId } = await params
  const store = await getStoreBySlug(storeId)

  if (!store) notFound()

  return <StorefrontPage store={store} basePath={`/stores/${store.id}`} />
}
