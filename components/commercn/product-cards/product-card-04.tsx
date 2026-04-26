"use client"

import { Heart, ShoppingCart } from "lucide-react"
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
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--store-panel)]">
        <img src={image} alt={name} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]" />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-white/92 text-zinc-900 opacity-100 backdrop-blur-sm transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100"
          onClick={(event) => event.stopPropagation()}
        >
          <Heart className="size-4" />
        </button>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-start opacity-100 transition-all duration-200 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            type="button"
            className="pointer-events-auto inline-flex h-9 items-center gap-2 bg-white px-3 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-950 shadow-sm transition hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-zinc-400"
            disabled={isInCart || isOutOfStock}
            onClick={(event) => {
              event.stopPropagation()
              onAddToCart?.()
            }}
          >
            <ShoppingCart className="size-3.5" />
            <span>{isOutOfStock ? "Sold out" : isInCart ? "Added" : "Quick add"}</span>
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-zinc-500">{category || "Collection item"}</p>
        <h3 className="line-clamp-2 text-[1.03rem] font-medium tracking-[-0.03em] text-zinc-950">{name}</h3>
        <p className="text-[0.95rem] font-medium text-zinc-950">${price.toFixed(2)}</p>
        {isOutOfStock ? (
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">Sold out</p>
        ) : lowStockText ? (
          <p className="text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">{lowStockText}</p>
        ) : null}
      </div>
    </article>
  )
}
