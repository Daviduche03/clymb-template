"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ShoppingCartOne } from "@/components/commercn/carts/cart-01"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { mapNavigationForStore, storefronts } from "@/lib/storefront-data"

export default function StoreCartPage() {
  const params = useParams<{ store: string }>()
  const storeId = params.store
  const { lines, cartTotal, setLineQty, removeLine, isLoaded } = useCart(storeId)
  const store = storefronts.find((s) => s.id === storeId) ?? storefronts[0]
  const cartLines = Object.values(lines)
  const lineCount = cartLines.reduce((sum, line) => sum + line.quantity, 0)
  const navigation = mapNavigationForStore(`/stores/${store.id}`, store.navigation)

  if (!isLoaded) return null;

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white text-zinc-900">
        <Header
          navigationData={navigation}
          logoUrl={store.theme?.logoUrl}
          className="border-zinc-200 bg-white"
        />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-zinc-600">Review your items before checkout.</p>
              <h1 className="text-3xl font-bold">Your Cart</h1>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/stores/${store.id}`}>Continue shopping</Link>
            </Button>
          </div>

          {cartLines.length === 0 ? (
            <div className="rounded-2xl bg-zinc-100 px-6 py-10 text-center">
              <p className="text-base text-zinc-700">Your cart is empty.</p>
              <Button className="mt-4" asChild>
                <Link href={`/stores/${store.id}`}>Shop products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
              <div className="flex flex-col gap-4">
                {cartLines.map((line) => (
                  <ShoppingCartOne
                    key={line.id}
                    line={line}
                    onQuantityChange={(q) => setLineQty(line.id, q)}
                    onRemove={() => removeLine(line.id)}
                  />
                ))}
              </div>

              <div className="h-fit rounded-2xl bg-zinc-100 p-5">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <div className="mt-4 space-y-2 text-sm text-zinc-700">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span>{lineCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="my-4 border-t border-zinc-200" />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Button className="mt-5 w-full" size="lg" asChild>
                  <Link href={`/stores/${store.id}/checkout`}>Proceed to checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </StoreThemeProvider>
  )
}
