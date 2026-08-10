"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CartQtyControl } from "@/components/storefront/cart-qty-control"
import { useCartLineState, formatLineMeta, formatMoney } from "@/lib/cart"
import type { ShoppingCartLineProps, StorefrontVariants } from "@/lib/types"

type CartLineProps = ShoppingCartLineProps & {
  variant?: StorefrontVariants["cartStyle"]
}

function CartLineOne({ line, onQuantityChange, onRemove, className }: ShoppingCartLineProps) {
  const { item, controlled, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)
  const lineTotal = item.price * item.quantity

  return (
    <article
      className={cn(
        "grid w-full grid-cols-[88px_1fr] gap-4 border border-zinc-200 bg-white p-4 sm:grid-cols-[112px_1fr]",
        className,
      )}
    >
      <div className="aspect-square overflow-hidden bg-zinc-100">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {meta ? (
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">{meta}</p>
            ) : null}
            <h3 className="truncate text-base font-semibold tracking-[-0.02em] text-zinc-950">{item.name}</h3>
            <p className="text-sm text-zinc-500">{formatMoney(item.price, item.currency)} each</p>
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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <CartQtyControl quantity={item.quantity} onDecrement={decrement} onIncrement={increment} />
          <p className="text-lg font-semibold text-zinc-950">{formatMoney(lineTotal, item.currency)}</p>
        </div>
      </div>
    </article>
  )
}

function CartLineTwo({ line, onQuantityChange, onRemove, className }: ShoppingCartLineProps) {
  const { item, controlled, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)
  const lineTotal = item.price * item.quantity

  return (
    <article
      className={cn(
        "flex w-full items-center gap-3 border-b border-zinc-200 py-4 last:border-b-0",
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

function CartLineThree({ line, onQuantityChange, onRemove, className }: ShoppingCartLineProps) {
  const { item, controlled, increment, decrement } = useCartLineState({ line, onQuantityChange, onRemove })
  const meta = formatLineMeta(item)
  const lineTotal = item.price * item.quantity

  return (
    <article
      className={cn(
        "flex w-full flex-col overflow-hidden border border-zinc-200 bg-zinc-50 sm:flex-row",
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
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-zinc-950">{item.name}</h3>
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

export function CartLine({ variant = "cart-01", ...props }: CartLineProps) {
  switch (variant) {
    case "cart-02":
      return <CartLineTwo {...props} />
    case "cart-03":
      return <CartLineThree {...props} />
    default:
      return <CartLineOne {...props} />
  }
}