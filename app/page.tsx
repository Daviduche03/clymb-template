import Link from "next/link"
import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { StorefrontPage } from "@/components/storefront/storefront-page"
import { getDefaultStorefrontConfig, getStore, DEFAULT_STORE_ID } from "@/lib/api/store-client"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const host = (await headers()).get("host") || "localhost:3001"
  const origin = `http://${host}`
  const store = await getDefaultStorefrontConfig({ origin })

  if (!store) return notFound()

  let stores: Array<{ slug: string; name: string }> = []
  try {
    const defaultStore = await getStore(DEFAULT_STORE_ID)
    stores = [defaultStore]
  } catch {}

  return (
    <>
      <StorefrontPage store={store} basePath="" />

      <section className="border-t px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {stores.map((s) => (
            <Button key={s.slug} variant="outline" size="sm" asChild>
              <Link href={`/stores/${s.slug}`}>{s.name}</Link>
            </Button>
          ))}
        </div>
      </section>
    </>
  )
}
