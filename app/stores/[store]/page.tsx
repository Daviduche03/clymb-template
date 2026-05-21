import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { StorefrontPage } from "@/components/storefront/storefront-page"
import { getStorefrontConfig } from "@/lib/api/store-client"

export default async function StorePage({
  params,
}: {
  params: Promise<{ store: string }>
}) {
  const { store: storeId } = await params
  const host = (await headers()).get("host") || "localhost:3001"
  const origin = `http://${host}`
  const store = await getStorefrontConfig(storeId, { origin })

  if (!store) notFound()

  return <StorefrontPage store={store} basePath={`/stores/${store.id}`} />
}
