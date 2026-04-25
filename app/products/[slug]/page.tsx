import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductDetailOne } from "@/components/commercn/product-details/product-detail-01"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { Button } from "@/components/ui/button"
import { mapNavigationForStore, productToDetailModel } from "@/lib/storefront-data"
import { getDefaultStore } from "@/lib/api/stores"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const store = await getDefaultStore()

  if (!store) notFound()

  const product = store.products.find((p) => p.slug === slug)
  if (!product) notFound()

  const relatedProducts = store.products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3)
    .map((p) => ({ ...p, href: `/products/${p.slug}` }))
  const navigation = mapNavigationForStore("", store.navigation)

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white text-zinc-900">
        <Header
          navigationData={navigation}
          logoUrl={store.theme?.logoUrl}
          className="border-zinc-200 bg-white"
          homeHref="/"
        />
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
            <Link href="/" className="hover:text-zinc-900">
              Store
            </Link>{" "}
            / {product.name}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Product details</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">Built for a quieter wardrobe.</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-none" asChild>
                <Link href="/">Back to store</Link>
              </Button>
              <Button className="rounded-none" asChild>
                <Link href="/cart">Go to cart</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="pt-6">
          <ProductDetailOne product={productToDetailModel(product)} />
        </div>
        {relatedProducts.length > 0 ? (
          <div className="mx-auto mt-10 max-w-7xl border-t border-zinc-200 px-4 pt-10 sm:px-6 lg:px-8">
            <ProductList
              title="Complete the edit"
              badge="Recommended"
              products={relatedProducts}
            />
          </div>
        ) : null}
      </main>
    </StoreThemeProvider>
  )
}
