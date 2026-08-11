"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useMemo } from "react"
import { Lock, ShieldCheck, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import { StorefrontHeader } from "@/components/storefront/storefront-header"
import { ShippingEstimator, type ShippingEstimate } from "@/components/storefront/shipping-estimator"
import { useCart } from "@/hooks/use-cart"
import { mapNavigationForStore } from "@/lib/types"
import type { StorefrontConfig } from "@/lib/types"
import { DEFAULT_STORE_ID, getStorefrontConfig } from "@/lib/api/store-client"
import { formatMoney } from "@/lib/cart"

function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 animate-pulse border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-24 bg-zinc-100" />
          <div className="h-4 w-32 bg-zinc-100" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse bg-zinc-100" />
        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_384px]">
          <div className="space-y-6">
            <div className="h-64 animate-pulse rounded-none border border-zinc-200 bg-zinc-50" />
            <div className="h-40 animate-pulse rounded-none border border-zinc-200 bg-zinc-50" />
          </div>
          <div className="h-96 animate-pulse border border-zinc-200 bg-zinc-50" />
        </div>
      </div>
    </main>
  )
}

function CheckoutPageContent({ store }: { store: StorefrontConfig }) {
  const { lines, cartTotal, isLoaded, cartStoreId, sessionToken } = useCart(store.id)

  const [email, setEmail] = useState("")
  const [shipping, setShipping] = useState<ShippingEstimate | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  const cartLinesArray = useMemo(() => Object.values(lines), [lines])
  const lineCount = cartLinesArray.reduce((sum, line) => sum + line.quantity, 0)
  const activeStoreId = cartStoreId ?? store.id
  const navigation = mapNavigationForStore(store.navigation)
  const shippingCost = shipping?.cost ?? 0
  const shippingKnown = shipping != null
  const orderTotal = cartTotal + shippingCost

  if (!isLoaded) return <CheckoutLoading />

  if (cartLinesArray.length === 0) {
    return (
      <StoreThemeProvider config={store}>
        <main className="min-h-screen bg-white text-zinc-900">
          <StorefrontHeader store={store} navigation={navigation} className="border-zinc-200 bg-white" />
          <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-400">
              Checkout
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-zinc-950">
              Nothing to check out, yet.
            </h1>
            <p className="mt-4 text-zinc-500">Your cart is empty. Add a few things and come back.</p>
            <Button
              className="mt-8 h-12 rounded-none px-8 text-xs uppercase tracking-[0.24em]"
              asChild
            >
              <Link href="/">Return to store</Link>
            </Button>
          </div>
        </main>
      </StoreThemeProvider>
    )
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const token =
        sessionToken ||
        (typeof window !== "undefined"
          ? window.localStorage.getItem(`storefront_cart_session_v1:${activeStoreId}`)
          : null)

      if (!token) {
        throw new Error("Cart session expired. Add items again and retry checkout.")
      }

      const { checkout } = await import("@/lib/api/store-client")
      const result = await checkout(activeStoreId, {
        sessionToken: token,
        customerEmail: email,
        shippingAddress: shipping
          ? `${shipping.city}, ${shipping.region}, ${shipping.country}`
          : undefined,
        idempotencyKey,
      })

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
        return
      }

      window.location.href = `/orders/${result.order.id}?session=${encodeURIComponent(token)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process checkout.")
      setIsSubmitting(false)
    }
  }

  const inputClass =
    "h-11 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-zinc-50 text-zinc-900">
        <StorefrontHeader store={store} navigation={navigation} className="border-zinc-200 bg-white" />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-400">
            {store.name} · Checkout
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-5xl">
              Checkout
            </h1>
            <Link
              href="/cart"
              className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950"
            >
              Back to cart
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_384px]">
            <form onSubmit={handleCheckout} className="space-y-10">
              <section>
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-[0.7rem] font-medium tracking-[0.14em] text-white">
                    01
                  </span>
                  <h2 className="text-lg font-medium tracking-[-0.02em] text-zinc-950">
                    Contact &amp; shipping
                  </h2>
                </div>
                <div className="mt-5 space-y-5 border border-zinc-200 bg-white p-6 sm:p-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <ShippingEstimator
                  subtotal={cartTotal}
                  freeShippingThreshold={50}
                  onEstimate={setShipping}
                  className="mt-5"
                />
              </section>

              <section>
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-[0.7rem] font-medium tracking-[0.14em] text-white">
                    02
                  </span>
                  <h2 className="text-lg font-medium tracking-[-0.02em] text-zinc-950">
                    Payment
                  </h2>
                </div>
                <div className="mt-5 border border-zinc-200 bg-white p-6 sm:p-8">
                  <div className="flex items-center gap-3 border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <Lock className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm text-zinc-600">
                      You&apos;ll be redirected to Polar to complete payment securely.
                    </p>
                  </div>

                  {error && (
                    <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="mt-6 h-12 w-full rounded-none bg-zinc-950 px-8 text-xs uppercase tracking-[0.24em] text-white hover:bg-zinc-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing…"
                      : `Pay ${formatMoney(orderTotal)}`}
                  </Button>
                  <p className="mt-3 text-center text-xs text-zinc-400">
                    Your order details and {cartTotal > 0 ? `$${cartTotal.toFixed(2)}` : "total"} are
                    secured with encryption.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-4 border-t border-zinc-200 pt-6 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-zinc-400" />
                  <p className="text-xs text-zinc-500">Free shipping over $50</p>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-4 w-4 text-zinc-400" />
                  <p className="text-xs text-zinc-500">30-day returns</p>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-zinc-400" />
                  <p className="text-xs text-zinc-500">Secure payment via Polar</p>
                </div>
              </div>
            </form>

            <aside className="h-fit lg:sticky lg:top-6">
              <div className="border border-zinc-200 bg-white">
                <div className="border-b border-zinc-200 px-6 py-5">
                  <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-900">
                    Order summary
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    {lineCount} {lineCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="max-h-[340px] divide-y divide-zinc-100 overflow-y-auto px-6">
                  {cartLinesArray.map((line) => (
                    <div key={line.id} className="flex items-center gap-4 py-4">
                      <div className="relative h-16 w-16 flex-none overflow-hidden bg-zinc-100">
                        <img
                          src={line.image}
                          alt={line.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center bg-zinc-950 px-1 text-[0.65rem] font-medium text-white">
                          {line.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-950">{line.name}</p>
                        <p className="text-xs text-zinc-400">
                          {line.variantTitle || line.category || "Default"}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-zinc-950">
                        {formatMoney(line.price * line.quantity, line.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-zinc-200 px-6 py-5 text-sm">
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span>{formatMoney(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-500">
                    <span>Shipping</span>
                    {shippingKnown ? (
                      <span className={cn(shippingCost === 0 ? "text-emerald-600" : "text-zinc-900")}>
                        {shippingCost === 0 ? "Free" : formatMoney(shippingCost)}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("shipping-country")?.scrollIntoView({ behavior: "smooth", block: "center" })
                        }
                        className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-900"
                      >
                        Calculate
                      </button>
                    )}
                  </div>
                  <div className="my-2 border-t border-zinc-200" />
                  <div className="flex items-center justify-between text-base font-semibold text-zinc-950">
                    <span>Total</span>
                    <span>{formatMoney(orderTotal)}</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </StoreThemeProvider>
  )
}

export default function CheckoutPage() {
  const [store, setStore] = useState<StorefrontConfig | null>(null)

  useEffect(() => {
    void getStorefrontConfig(DEFAULT_STORE_ID).then((config) => {
      if (config) setStore(config)
    })
  }, [])

  if (!store) return <CheckoutLoading />

  return <CheckoutPageContent store={store} />
}