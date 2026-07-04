"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ShoppingCartLineProps } from "@/components/commercn/carts/cart-types"
import { formatLineMeta, formatMoney, useCartLineState } from "@/components/commercn/carts/cart-utils"
import { CartQtyControl } from "@/components/commercn/carts/cart-qty-control"

export function ShoppingCartTwo({ line, onQuantityChange, onRemove, className }: ShoppingCartLineProps) {
  const { item, controlled, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)
  const lineTotal = item.price * item.quantity

  return (
    <article
      className={cn(
        "not-prose flex w-full items-center gap-3 border-b border-zinc-200 py-4 last:border-b-0",
        className,
      )}
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden bg-zinc-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-zinc-950">{item.name}</h3>
            <p className="mt-0.5 text-xs text-zinc-500">
              {[meta, formatMoney(item.price, item.currency)].filter(Boolean).join(" · ")}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-zinc-950">{formatMoney(lineTotal, item.currency)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <CartQtyControl
            quantity={item.quantity}
            onDecrement={decrement}
            onIncrement={increment}
            compact
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-none px-2 text-xs text-zinc-500 hover:text-zinc-950"
            onClick={() => controlled && onRemove?.()}
            disabled={!controlled}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
      </div>
    </article>
  )
}
