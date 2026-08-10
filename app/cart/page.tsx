"use client"

import { useEffect, useState } from "react"
import { CartPageShell } from "@/components/storefront/cart-page-shell"
import { CartPageSkeleton } from "@/components/storefront/cart-page-skeleton"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { useCart } from "@/hooks/use-cart"
import { mapNavigationForStore } from "@/lib/types"
import type { StorefrontConfig } from "@/lib/types"
import { DEFAULT_STORE_ID, getStorefrontConfig } from "@/lib/api/store-client"

function CartPageContent({ store }: { store: StorefrontConfig }) {
  const { lines, cartTotal, setLineQty, removeLine, isLoaded } = useCart(store.id)

  if (!isLoaded) return <CartPageSkeleton />

  const cartLines = Object.values(lines)
  const lineCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)
  const navigation = mapNavigationForStore(store.navigation)

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white text-zinc-900">
        <StorefrontHeader
          store={store}
          navigation={navigation}
          className="border-zinc-200 bg-white"
        />
        <CartPageShell
          store={store}
          lines={cartLines}
          lineCount={lineCount}
          cartTotal={cartTotal}
          continueHref="/"
          checkoutHref="/checkout"
          onQuantityChange={setLineQty}
          onRemove={removeLine}
        />
      </main>
    </StoreThemeProvider>
  )
}

export default function CartPage() {
  const [store, setStore] = useState<StorefrontConfig | null>(null)

  useEffect(() => {
    void getStorefrontConfig(DEFAULT_STORE_ID).then((config) => {
      if (config) setStore(config)
    })
  }, [])

  if (!store) return <CartPageSkeleton />

  return <CartPageContent store={store} />
}
