"use client"

import Link from "next/link"
import { Trash2 } from "lucide-react"
import { CartQtyControl } from "@/components/storefront/cart-qty-control"
import { formatLineMeta, formatMoney, useCartLineState } from "@/lib/cart"
import type { ShoppingCartLine } from "@/lib/types"

export type CartRoute2LineProps = {
  line?: ShoppingCartLine
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
}

export function CartRoute2Line({ line, onQuantityChange, onRemove }: CartRoute2LineProps) {
  const { item, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)

  return (
    <li className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-start gap-4 py-5 sm:grid-cols-[96px_minmax(0,1fr)_auto]">
      <div className="aspect-square overflow-hidden rounded-lg border border-zinc-100 bg-zinc-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {meta ? (
              <span className="inline-flex border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-zinc-500">
                {meta}
              </span>
            ) : null}
            <h3 className="mt-1 truncate text-sm font-semibold text-zinc-950 sm:text-base">{item.name}</h3>
            <p className="mt-0.5 text-sm text-zinc-500">{formatMoney(item.price, item.currency)} each</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <CartQtyControl compact quantity={item.quantity} onDecrement={decrement} onIncrement={increment} />
          <span className="text-sm font-semibold text-zinc-900">{formatMoney(item.price * item.quantity, item.currency)}</span>
        </div>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.name} from cart`}
          className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  )
}

export function CartRoute2Empty({ href }: { href: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-zinc-200 bg-zinc-50/50 px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white">
        <span className="text-lg text-zinc-400">🛍</span>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-zinc-900">Your cart is empty</h2>
      <p className="mt-1 text-sm text-zinc-500">Looks like you haven&apos;t added anything yet.</p>
      <Link
        href={href}
        className="mt-5 inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        Continue shopping
      </Link>
    </div>
  )
}