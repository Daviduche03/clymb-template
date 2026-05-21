import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { ProductDetailPageClient } from "@/components/storefront/product-detail-page-client"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { getDefaultStorefrontConfig } from "@/lib/api/store-client"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const host = (await headers()).get("host") || "localhost:3001"
  const origin = `http://${host}`
  const store = await getDefaultStorefrontConfig({ origin })
  if (!store) notFound()
  const product = store.products.find((p) => p.slug === slug)

  if (!product) notFound()
  const relatedProducts = store.products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <StoreThemeProvider config={store}>
      <ProductDetailPageClient store={store} product={product} relatedProducts={relatedProducts} />
    </StoreThemeProvider>
  )
}
