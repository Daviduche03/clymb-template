"use client"

import Link from "next/link"
import { ProductDetailOne } from "@/components/storefront/product-detail-one"
import { ProductDetailTwo } from "@/components/storefront/product-detail-two"
import { ProductDetailThree } from "@/components/storefront/product-detail-three"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { useCart } from "@/hooks/use-cart"
import {
  mapNavigationForStore,
  productToDetailModel,
  toCartLine,
  type StoreProduct,
  type StorefrontConfig,
} from "@/lib/types"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { StoreAnalyticsTracker } from "@/components/storefront/store-analytics-tracker"
import { Button } from "@/components/ui/button"

type ProductDetailPageClientProps = {
  store: StorefrontConfig
  product: StoreProduct
  relatedProducts: StoreProduct[]
}

export function ProductDetailPageClient({
  store,
  product,
  relatedProducts,
}: ProductDetailPageClientProps) {
  const { addToCart } = useCart(store.id)
  const navigation = mapNavigationForStore(store.navigation)
  const cartHref = "/cart"
  const storeHref = "/"

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <StoreAnalyticsTracker storeId={store.id} productId={product.id} />
      <StorefrontHeader
        store={store}
        navigation={navigation}
        className="border-zinc-200 bg-white"
      />

      <div className="mx-auto mb-6 mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm text-zinc-600">
          <Link href={storeHref} className="hover:underline">
            {store.name}
          </Link>{" "}
          / <span className="text-zinc-900">{product.name}</span>
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Product Details</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={storeHref}>Back to store</Link>
            </Button>
            <Button className="border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800" asChild>
              <Link href={cartHref}>Go to cart</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {store.variants.productPage === "gallery-sticky-left" ? (
          <ProductDetailTwo
            product={productToDetailModel(product)}
            className="mx-auto max-w-none"
            onAddToCart={(quantity, size) => addToCart(toCartLine(product, quantity, size))}
          />
        ) : store.variants.productPage === "gallery-sticky-right" ? (
          <ProductDetailThree
            product={productToDetailModel(product)}
            className="mx-auto max-w-none"
            onAddToCart={(quantity, size) => addToCart(toCartLine(product, quantity, size))}
          />
        ) : (
          <ProductDetailOne
            product={productToDetailModel(product)}
            variant={store.variants.productPage}
            className="mx-auto max-w-none"
            onAddToCart={(quantity, size) => addToCart(toCartLine(product, quantity, size))}
          />
        )}
      </div>

      {relatedProducts.length > 0 ? (
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
          <ProductList
            title="You may also like"
            badge="Recommended"
            variant={store.variants.header === "header-03" ? "grid-02" : "grid-01"}
            products={relatedProducts.map((entry) => ({
              ...entry,
              href: `/products/${entry.slug}`,
            }))}
          />
        </div>
      ) : null}
    </main>
  )
}
