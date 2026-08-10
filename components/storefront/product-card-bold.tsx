"use client"

import Link from "next/link"
import { HeartIcon, ShoppingCartIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import type { ProductItem } from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { cn } from "@/lib/utils"

type ProductCardBoldProps = {
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

export function ProductCardBold({
  product,
  onProductClick,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isInCart,
  isOutOfStock,
  isLowStock,
  className,
}: ProductCardBoldProps) {
  const image = (
    <img
      src={product.image}
      alt={product.imgAlt}
      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )

  return (
    <article className={cn("group flex flex-col", className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        {product.href ? (
          <Link href={product.href} className="block h-full w-full">{image}</Link>
        ) : onProductClick ? (
          <button type="button" className="block h-full w-full" onClick={() => onProductClick(product)}>{image}</button>
        ) : (
          <div className="h-full w-full">{image}</div>
        )}

        {onToggleWishlist ? (
          <div className="absolute right-3 top-3">
            <CheckboxPrimitive.Root
              data-slot="checkbox"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-zinc-900 outline-none backdrop-blur-sm transition hover:bg-white"
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
          </div>
        ) : null}

        {isOutOfStock?.(product) ? (
          <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-zinc-600">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.66rem] uppercase tracking-[0.22em] text-zinc-500">
          {product.badges[0] ?? "Collection"}
        </p>
        {product.href ? (
          <Link href={product.href} className="block">
            <h3 className="mt-1.5 line-clamp-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">
              {product.name}
            </h3>
          </Link>
        ) : onProductClick ? (
          <button type="button" className="block text-left" onClick={() => onProductClick(product)}>
            <h3 className="mt-1.5 line-clamp-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">
              {product.name}
            </h3>
          </button>
        ) : (
          <h3 className="mt-1.5 line-clamp-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">
            {product.name}
          </h3>
        )}

        <p className="mt-2 text-lg font-semibold text-zinc-950">${(product.salePrice ?? product.price).toFixed(2)}</p>

        <div className="mt-4 border-t border-zinc-200 pt-3">
          {onAddToCart ? (
            <button
              type="button"
              disabled={isOutOfStock?.(product) || isInCart?.(product)}
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              className="inline-flex items-center gap-2 text-[0.66rem] font-medium uppercase tracking-[0.22em] text-zinc-950 transition-colors hover:text-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-300"
            >
              <ShoppingCartIcon className="size-3.5" />
              <span>
                {isOutOfStock?.(product) ? "Sold out" : isInCart?.(product) ? "Added" : "Add to cart"}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}