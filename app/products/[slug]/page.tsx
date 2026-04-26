import { notFound } from "next/navigation"
import { ProductDetailPageClient } from "@/components/storefront/product-detail-page-client"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
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
  const relatedProducts = store.products.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <StoreThemeProvider config={store}>
      <ProductDetailPageClient store={store} product={product} relatedProducts={relatedProducts} />
    </StoreThemeProvider>
  )
}
