"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ShoppingCartLineProps } from "@/components/commercn/carts/cart-types"
import { formatLineMeta, formatMoney, useCartLineState } from "@/components/commercn/carts/cart-utils"
import { CartQtyControl } from "@/components/commercn/carts/cart-qty-control"

export function ShoppingCartThree({ line, onQuantityChange, onRemove, className }: ShoppingCartLineProps) {
  const { item, controlled, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)
  const lineTotal = item.price * item.quantity

  return (
    <article
      className={cn(
        "not-prose flex w-full flex-col overflow-hidden border border-zinc-200 bg-zinc-50 sm:flex-row",
        className,
      )}
    >
      <div className="aspect-[4/3] w-full shrink-0 bg-zinc-100 sm:aspect-auto sm:h-40 sm:w-40">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {meta ? (
              <span className="inline-flex border border-zinc-300 bg-white px-2 py-0.5 text-[11px] uppercase tracking-[0.12em] text-zinc-600">
                {meta}
              </span>
            ) : null}
            <div>
              <h3 className="text-lg font-semibold text-zinc-950">{item.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{formatMoney(item.price, item.currency)} each</p>
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 shrink-0 rounded-none text-zinc-500 hover:text-zinc-950"
            onClick={() => controlled && onRemove?.()}
            disabled={!controlled}
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4">
          <CartQtyControl quantity={item.quantity} onDecrement={decrement} onIncrement={increment} />
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">Line total</p>
            <p className="text-xl font-semibold text-zinc-950">{formatMoney(lineTotal, item.currency)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}
