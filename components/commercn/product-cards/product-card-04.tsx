"use client"

import { ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ProductCardProps } from "./product-card-01"

export function ProductCardFour({
  name,
  category,
  price,
  image,
  isInCart = false,
  isOutOfStock = false,
  lowStockText,
  onAddToCart,
  onClick,
  className,
}: ProductCardProps) {
  return (
    <article className={cn("group w-full cursor-pointer", className)} onClick={onClick}>
      <div className="relative aspect-[0.8] overflow-hidden bg-[var(--store-panel)]">
        <img src={image} alt={name} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]" />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/90 text-zinc-700 backdrop-blur-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">{category || "Collection item"}</p>
            <h3 className="mt-2 line-clamp-2 text-[1.05rem] font-medium tracking-[-0.03em] text-zinc-950">{name}</h3>
            {isOutOfStock ? (
              <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-rose-600">Out of stock</p>
            ) : lowStockText ? (
              <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-amber-600">{lowStockText}</p>
            ) : null}
          </div>
          <p className="shrink-0 text-sm font-medium text-zinc-950">${price.toFixed(2)}</p>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 pt-3">
          <Button
            type="button"
            variant="ghost"
            className="h-auto rounded-none px-0 text-[0.68rem] uppercase tracking-[0.22em] text-zinc-950 hover:bg-transparent"
            disabled={isInCart || isOutOfStock}
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart?.()
            }}
          >
            {isOutOfStock ? "Sold out" : isInCart ? "Added" : "Quick add"}
          </Button>
          <ArrowRight className="size-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  )
}
