import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { StorefrontPage } from "@/components/storefront/storefront-page"
import { getDefaultStorefrontConfig } from "@/lib/api/store-client"

export default async function Page() {
  const host = (await headers()).get("host") || "localhost:3001"
  const origin = `http://${host}`
  const store = await getDefaultStorefrontConfig({ origin })

  if (!store) return notFound()

  return <StorefrontPage store={store} />
}