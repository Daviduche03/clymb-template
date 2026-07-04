"use client"

import { useState, use, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/hooks/use-cart"

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ store: string }>
}) {
  const { store } = use(params)
  const { lines, cartTotal, isLoaded, cartStoreId, sessionToken } = useCart(store)

  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [idempotencyKey] = useState(() => crypto.randomUUID())

  const cartLinesArray = useMemo(() => Object.values(lines), [lines])
  const activeStoreId = cartStoreId ?? store

  if (!isLoaded) return null

  if (cartLinesArray.length === 0) {
    return (
      <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => { window.location.href = `/stores/${activeStoreId}` }}>Return to Store</Button>
      </main>
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
        shippingAddress: address,
        idempotencyKey,
      })

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl
        return
      }

      window.location.href = `/stores/${activeStoreId}/orders/${result.order.id}?session=${encodeURIComponent(token)}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process checkout.")
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <p className="text-sm text-muted-foreground">
                You&apos;ll be redirected to Polar to complete payment securely.
              </p>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay $${cartTotal.toFixed(2)}`}
              </Button>
            </div>
          </form>

          <div>
            <div className="rounded-lg border p-6 sticky top-6 bg-muted/30">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {cartLinesArray.map((line) => (
                  <div key={line.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 border">
                        <img src={line.image} alt={line.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{line.name}</p>
                        <p className="text-muted-foreground">Qty: {line.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">${(line.price * line.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <p>Total</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
