"use client"

import Link from "next/link"
import { ShieldCheck, Truck } from "lucide-react"
import { CartRoute2Empty, CartRoute2Line } from "@/components/storefront/cart-line-route-2"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type CartPageShellRoute2Props = {
  lines: ShoppingCartLine[]
  lineCount: number
  cartTotal: number
  storeName: string
  continueHref: string
  checkoutHref: string
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartPageShellRoute2({
  lines,
  lineCount,
  cartTotal,
  storeName,
  continueHref,
  checkoutHref,
  onQuantityChange,
  onRemove,
}: CartPageShellRoute2Props) {
  const isEmpty = lines.length === 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <p className="text-sm text-zinc-500">Review your items before checkout.</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950">Your cart</h1>
          <p className="mt-2 text-sm text-zinc-500">
            {lineCount} {lineCount === 1 ? "item" : "items"} · {storeName}
          </p>
        </div>
        <Button variant="outline" className="rounded-none" asChild>
          <Link href={continueHref}>Continue shopping</Link>
        </Button>
      </div>

      {isEmpty ? (
        <CartRoute2Empty href={continueHref} />
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ul className="divide-y divide-zinc-100">
            {lines.map((line) => (
              <CartRoute2Line
                key={line.id}
                line={line}
                onQuantityChange={(quantity) => onQuantityChange(line.id, quantity)}
                onRemove={() => onRemove(line.id)}
              />
            ))}
          </ul>

          <aside className="sticky top-6 space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="text-base font-semibold text-zinc-950">Order summary</h2>

              <dl className="mt-4 space-y-3 text-sm text-zinc-600">
                <div className="flex items-center justify-between">
                  <dt>Items</dt>
                  <dd className="font-medium text-zinc-900">{lineCount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-zinc-900">${cartTotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-emerald-600">Free</dd>
                </div>
              </dl>

              <div className="my-4 border-t border-zinc-100" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-zinc-950">Total</span>
                <span className="text-xl font-semibold text-zinc-950">${cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-5">
                <Link
                  href={checkoutHref}
                  className="flex h-11 w-full items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>

            <ul className="space-y-2 text-sm text-zinc-500">
              <li className={cn("flex items-center gap-2")}>
                <Truck className="h-4 w-4 text-zinc-400" />
                Free standard shipping on all orders
              </li>
              <li className={cn("flex items-center gap-2")}>
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
                Secure checkout, encrypted payment
              </li>
            </ul>
          </aside>
        </div>
      )}
    </div>
  )
}