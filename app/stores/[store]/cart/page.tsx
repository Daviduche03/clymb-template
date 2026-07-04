"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { CartPageShell } from "@/components/storefront/cart-page-shell"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { useCart } from "@/hooks/use-cart"
import { mapNavigationForStore } from "@/lib/types"
import type { StorefrontConfig } from "@/lib/types"

export default function StoreCartPage() {
  const params = useParams<{ store: string }>()
  const storeId = params.store
  const { lines, cartTotal, setLineQty, removeLine, isLoaded } = useCart(storeId)
  const [store, setStore] = useState<StorefrontConfig | null>(null)

  useEffect(() => {
    import("@/lib/api/store-client").then(({ getStorefrontConfig }) => {
      getStorefrontConfig(storeId).then((config) => {
        if (config) setStore(config)
      })
    })
  }, [storeId])

  if (!isLoaded || !store) return null

  const cartLines = Object.values(lines)
  const lineCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)
  const navigation = mapNavigationForStore(`/stores/${store.id}`, store.navigation)

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white text-zinc-900">
        <Header
          navigationData={navigation}
          logoUrl={store.theme?.logoUrl}
          className="border-zinc-200 bg-white"
        />
        <CartPageShell
          store={store}
          lines={cartLines}
          lineCount={lineCount}
          cartTotal={cartTotal}
          continueHref={`/stores/${store.id}`}
          checkoutHref={`/stores/${store.id}/checkout`}
          onQuantityChange={setLineQty}
          onRemove={removeLine}
        />
      </main>
    </StoreThemeProvider>
  )
}
