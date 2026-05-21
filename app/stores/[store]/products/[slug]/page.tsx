import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ProductDetailPageClient } from "@/components/storefront/product-detail-page-client"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { getStorefrontConfig } from "@/lib/api/store-client"

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ store: string; slug: string }>
}) {
  const { store: storeId, slug } = await params
  const host = (await headers()).get("host") || "localhost:3001"
  const origin = `http://${host}`
  const store = await getStorefrontConfig(storeId, { origin })
  if (!store) notFound()

  const product = store.products.find((p) => p.slug === slug)
  if (!product) notFound()
  const relatedProducts = store.products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <StoreThemeProvider config={store}>
      <ProductDetailPageClient
        store={store}
        product={product}
        relatedProducts={relatedProducts}
        basePath={`/stores/${store.id}`}
      />
    </StoreThemeProvider>
  )
}
