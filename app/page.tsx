import Link from "next/link"
import { notFound } from "next/navigation"
import { StorefrontPage } from "@/components/storefront/storefront-page"
import { getDefaultStore } from "@/lib/api/stores"
import { storefronts } from "@/lib/storefront-data"
import { Button } from "@/components/ui/button"

export default async function Page() {
  const store = await getDefaultStore()

  if (!store) return notFound()

  return (
    <>
      <StorefrontPage store={store} basePath="" />

      <section className="border-t px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {storefronts.map((s) => (
            <Button key={s.id} variant="outline" size="sm" asChild>
              <Link href={`/stores/${s.id}`}>{s.name}</Link>
            </Button>
          ))}
        </div>
      </section>
    </>
  )
}
