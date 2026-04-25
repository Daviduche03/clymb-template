import { notFound } from "next/navigation"
import Link from "next/link"
import { ProductDetailOne } from "@/components/commercn/product-details/product-detail-01"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { Button } from "@/components/ui/button"
import { mapNavigationForStore, productToDetailModel } from "@/lib/storefront-data"
import { getStoreBySlug } from "@/lib/api/stores"

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ store: string; slug: string }>
}) {
  const { store: storeId, slug } = await params
  const store = await getStoreBySlug(storeId)
  if (!store) notFound()

  const product = store.products.find((p) => p.slug === slug)
  if (!product) notFound()
  const relatedProducts = store.products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3)
    .map((p) => ({ ...p, href: `/stores/${store.id}/products/${p.slug}` }))
  const navigation = mapNavigationForStore(`/stores/${store.id}`, store.navigation)

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white text-zinc-900">
        <Header
          navigationData={navigation}
          logoUrl={store.theme?.logoUrl}
          className="border-zinc-200 bg-white"
          homeHref={`/stores/${store.id}`}
        />
        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
            <Link href={`/stores/${store.id}`} className="hover:text-zinc-900">
              {store.name}
            </Link>{" "}
            / {product.name}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-5">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Product details</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">Refined essentials, built to wear hard.</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-none" asChild>
                <Link href={`/stores/${store.id}`}>Back to store</Link>
              </Button>
              <Button className="rounded-none" asChild>
                <Link href={`/stores/${store.id}/cart`}>Go to cart</Link>
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
