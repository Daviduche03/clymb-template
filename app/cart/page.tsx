"use client"

import { useEffect, useState } from "react"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { CartPageShell } from "@/components/storefront/cart-page-shell"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { useCart } from "@/hooks/use-cart"
import { mapNavigationForStore } from "@/lib/types"
import type { StorefrontConfig } from "@/lib/types"
import { DEFAULT_STORE_ID, getStorefrontConfig } from "@/lib/api/store-client"

function CartPageContent({ store }: { store: StorefrontConfig }) {
  const { lines, cartTotal, setLineQty, removeLine, isLoaded } = useCart(store.id)

  if (!isLoaded) return null

  const cartLines = Object.values(lines)
  const lineCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)
  const navigation = mapNavigationForStore("", store.navigation)

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
          continueHref="/"
          checkoutHref={`/stores/${store.id}/checkout`}
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

  if (!store) return null

  return <CartPageContent store={store} />
}
