"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Check, HeartIcon, ShoppingCartIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import type { ProductItem } from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { cn } from "@/lib/utils"

type ProductCardWideProps = {
  product: ProductItem
  onProductClick?: (product: ProductItem) => void
  onAddToCart?: (product: ProductItem) => void
  isWishlisted?: (product: ProductItem) => boolean
  onToggleWishlist?: (product: ProductItem) => void
  isInCart?: (product: ProductItem) => boolean
  isOutOfStock?: (product: ProductItem) => boolean
  isLowStock?: (product: ProductItem) => boolean
  className?: string
}

export function ProductCardWide({
  product,
  onProductClick,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isInCart,
  isOutOfStock,
  isLowStock,
  className,
}: ProductCardWideProps) {
  const [didAdd, setDidAdd] = useState(false)

  useEffect(() => {
    if (!didAdd) return
    const timeout = window.setTimeout(() => setDidAdd(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [didAdd])

  const image = (
    <img
      src={product.image}
      alt={product.imgAlt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )

  return (
    <article className={cn("group grid w-full grid-cols-[40%_1fr] gap-0 border border-zinc-200 bg-white", className)}>
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {product.href ? (
          <Link href={product.href} className="block h-full w-full">{image}</Link>
        ) : onProductClick ? (
          <button type="button" className="block h-full w-full" onClick={() => onProductClick(product)}>{image}</button>
        ) : (
          <div className="h-full w-full">{image}</div>
        )}
      </div>

      <div className="flex min-w-0 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[0.66rem] uppercase tracking-[0.22em] text-zinc-500">
            {product.badges[0] ?? "Collection"}
          </p>
          {onToggleWishlist ? (
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-900 outline-none transition hover:bg-zinc-50"
              aria-label="Save to wishlist"
              checked={isWishlisted?.(product) ?? false}
              onCheckedChange={() => onToggleWishlist?.(product)}
            >
              <span className="group-data-[state=checked]:hidden">
                <HeartIcon className="size-4" />
              </span>
              <span className="group-data-[state=unchecked]:hidden">
                <HeartIcon className="size-4 fill-zinc-950 stroke-zinc-950" />
              </span>
            </CheckboxPrimitive.Root>
          ) : null}
        </div>

        {product.href ? (
          <Link href={product.href} className="mt-1 block">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              {product.name}
            </h3>
          </Link>
        ) : onProductClick ? (
          <button type="button" className="mt-1 block text-left" onClick={() => onProductClick(product)}>
            <h3 className="line-clamp-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              {product.name}
            </h3>
          </button>
        ) : (
          <h3 className="mt-1 line-clamp-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
            {product.name}
          </h3>
        )}

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-2 text-zinc-950">
            <span className="text-base font-semibold">${(product.salePrice ?? product.price).toFixed(2)}</span>
            {product.salePrice ? (
              <span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
            ) : null}
          </div>

          {isOutOfStock?.(product) ? (
            <p className="mt-2 text-[0.66rem] uppercase tracking-[0.18em] text-zinc-400">Sold out</p>
          ) : isLowStock?.(product) ? (
            <p className="mt-2 text-[0.66rem] uppercase tracking-[0.18em] text-zinc-500">Low stock</p>
          ) : null}

          {onAddToCart ? (
            <button
              type="button"
              disabled={isOutOfStock?.(product) || (isInCart?.(product) && !didAdd)}
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
                setDidAdd(true)
              }}
              className={cn(
                "mt-3 inline-flex w-full items-center justify-center gap-2 border py-2 text-[0.66rem] font-medium uppercase tracking-[0.22em] transition-colors disabled:cursor-not-allowed disabled:text-zinc-300 disabled:hover:bg-transparent",
                didAdd
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-zinc-200 text-zinc-950 hover:bg-zinc-950 hover:text-white",
              )}
            >
              {didAdd ? <Check className="size-3.5" /> : <ShoppingCartIcon className="size-3.5" />}
              <span>
                {isOutOfStock?.(product) ? "Sold out" : didAdd ? "Added" : isInCart?.(product) ? "Added" : "Add to cart"}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}