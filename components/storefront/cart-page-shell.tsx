"use client"

import Link from "next/link"
import { CartLine } from "@/components/commercn/carts/cart-line"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-types"
import { Button } from "@/components/ui/button"
import { CartPageShellRoute2 } from "@/components/storefront/cart-page-shell-route-2"
import type { StorefrontConfig } from "@/lib/types"

type CartPageShellProps = {
  store: StorefrontConfig
  lines: ShoppingCartLine[]
  lineCount: number
  cartTotal: number
  continueHref: string
  checkoutHref: string
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartPageShell({
  store,
  lines,
  lineCount,
  cartTotal,
  continueHref,
  checkoutHref,
  onQuantityChange,
  onRemove,
}: CartPageShellProps) {
  const cartStyle = store.variants.cartStyle

  if (store.variants.cart === "route-2") {
    return (
      <CartPageShellRoute2
        lines={lines}
        lineCount={lineCount}
        cartTotal={cartTotal}
        storeName={store.name}
        continueHref={continueHref}
        checkoutHref={checkoutHref}
        onQuantityChange={onQuantityChange}
        onRemove={onRemove}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="text-sm text-zinc-500">Review your items before checkout.</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">Your Cart</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {lineCount} {lineCount === 1 ? "item" : "items"} · {store.name}
          </p>
        </div>
        <Button variant="outline" className="rounded-none" asChild>
          <Link href={continueHref}>Continue shopping</Link>
        </Button>
      </div>

      {lines.length === 0 ? (
        <div className="border border-zinc-200 bg-zinc-50 px-6 py-16 text-center">
          <p className="text-base text-zinc-700">Your cart is empty.</p>
          <Button className="mt-4 rounded-none border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800" asChild>
            <Link href={continueHref}>Shop products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div
            className={
              cartStyle === "cart-02"
                ? "border border-zinc-200 bg-white px-4"
                : cartStyle === "cart-03"
                  ? "flex flex-col gap-4"
                  : "flex flex-col gap-3"
            }
          >
            {lines.map((line) => (
              <CartLine
                key={line.id}
                variant={cartStyle}
                line={line}
                onQuantityChange={(quantity) => onQuantityChange(line.id, quantity)}
                onRemove={() => onRemove(line.id)}
              />
            ))}
          </div>

          <aside className="h-fit border border-zinc-200 bg-zinc-50 p-5">
            <h2 className="text-lg font-semibold text-zinc-950">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
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
            <div className="flex items-center justify-between text-base font-semibold text-zinc-950">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button
              className="mt-5 w-full rounded-none border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
              size="lg"
              asChild
            >
              <Link href={checkoutHref}>Proceed to checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  )
}
