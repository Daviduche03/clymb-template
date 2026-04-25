"use client"

import Link from "next/link"

import { HeartIcon, ShoppingCartIcon } from "lucide-react"

import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

export type ProductItem = {
	image: string
	imgAlt: string
	name: string
	price: number
	salePrice?: number
	inventory?: number
	badges: string[]
	href?: string
	slug: string
}

type ProductProps = {
	products: ProductItem[]
	title?: string
	badge?: string
	compact?: boolean
	onProductClick?: (product: ProductItem) => void
	onAddToCart?: (product: ProductItem) => void
	isWishlisted?: (product: ProductItem) => boolean
	onToggleWishlist?: (product: ProductItem) => void
	isInCart?: (product: ProductItem) => boolean
	isOutOfStock?: (product: ProductItem) => boolean
	isLowStock?: (product: ProductItem) => boolean
}

const ProductList = ({
	products,
	title = "All New Collection",
	badge,
	compact = false,
	onProductClick,
	onAddToCart,
	isWishlisted,
	onToggleWishlist,
	isInCart,
	isOutOfStock,
	isLowStock,
}: ProductProps) => {
	return (
		<section className={cn("bg-white", compact ? "py-2 sm:py-4" : "py-10 sm:py-14 lg:py-16")}>
			<div
				className={cn(
					"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					compact ? "space-y-6 sm:space-y-7" : "space-y-8 sm:space-y-10 lg:space-y-12",
				)}
			>
				<div className={cn("flex flex-wrap items-end justify-between gap-4 border-b border-zinc-200 pb-4", compact ? "pb-3" : "pb-5")}>
					<div className={cn(compact ? "space-y-1.5" : "space-y-2")}>
						{badge && <p className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-zinc-500">{badge}</p>}
						<h2 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">{title}</h2>
					</div>
					<p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
						{products.length} styles
					</p>
				</div>

				<div className="grid grid-cols-1 gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
					{products.map((product, index) => (
						<article
							key={index}
							className="group relative"
						>
								{product.href ? (
									<Link href={product.href} className="block w-full">
										<div className="relative aspect-[0.8] w-full overflow-hidden bg-[var(--store-panel)]">
										<div className="absolute left-3 top-3 z-10 bg-white/95 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-zinc-500">
											{product.salePrice ? "Sale" : product.badges[0] ?? "New"}
										</div>
										<img
											src={product.image}
											alt={product.imgAlt}
											className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
										/>
										<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
										</div>
									</Link>
								) : onProductClick ? (
									<button
										type="button"
										className="block w-full text-left"
										onClick={() => onProductClick(product)}
									>
										<div className="relative aspect-[0.8] w-full overflow-hidden bg-[var(--store-panel)]">
										<div className="absolute left-3 top-3 z-10 bg-white/95 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-zinc-500">
											{product.salePrice ? "Sale" : product.badges[0] ?? "New"}
										</div>
										<img
											src={product.image}
											alt={product.imgAlt}
											className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
										/>
										</div>
									</button>
								) : (
									<div className="relative aspect-[0.8] w-full overflow-hidden bg-[var(--store-panel)]">
									<div className="absolute left-3 top-3 z-10 bg-white/95 px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-zinc-500">
										{product.salePrice ? "Sale" : product.badges[0] ?? "New"}
									</div>
									<img
										src={product.image}
										alt={product.imgAlt}
										className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.025]"
									/>
									</div>
								)}

								<div className="mt-4 flex items-start justify-between gap-4">
									<div className="min-w-0 space-y-1">
										{product.href ? (
											<Link href={product.href} className="text-left">
												<h3 className="line-clamp-2 text-[1rem] font-medium tracking-[-0.03em] text-zinc-950 sm:text-[1.05rem]">{product.name}</h3>
											</Link>
										) : onProductClick ? (
											<button
												type="button"
												className="text-left"
												onClick={() => onProductClick(product)}
											>
												<h3 className="line-clamp-2 text-[1rem] font-medium tracking-[-0.03em] text-zinc-950 sm:text-[1.05rem]">{product.name}</h3>
											</button>
										) : (
											<h3 className="line-clamp-2 text-[1rem] font-medium tracking-[-0.03em] text-zinc-950 sm:text-[1.05rem]">{product.name}</h3>
										)}
										<p className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
											{isOutOfStock?.(product)
												? "Out of stock"
												: isLowStock?.(product)
													? "Low stock"
													: product.badges.slice(0, 2).join(" / ")}
										</p>
									</div>

									<div className="flex shrink-0 flex-col items-end gap-3">
										{!product.salePrice && (
											<span className="text-sm font-medium tracking-[0.02em] text-zinc-950">${product.price.toFixed(2)}</span>
										)}
										{product.salePrice && (
											<div className="flex flex-col items-end gap-0.5">
												<span className="text-sm font-medium tracking-[0.02em] text-zinc-950">
													${product.salePrice.toFixed(2)}
												</span>
												<span className="text-xs font-medium text-zinc-400 line-through">
													${product.price.toFixed(2)}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-200 pt-3">
									<CheckboxPrimitive.Root
										data-slot="checkbox"
										className="group inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-zinc-500 outline-none transition-colors hover:text-zinc-950"
										aria-label="Save to wishlist"
										checked={isWishlisted?.(product) ?? false}
										onCheckedChange={() => onToggleWishlist?.(product)}
									>
										<span className="group-data-[state=checked]:hidden">
											<HeartIcon className="size-4" />
										</span>
										<span className="group-data-[state=unchecked]:hidden">
											<HeartIcon className="size-4 fill-zinc-950 text-zinc-950" />
										</span>
										Save
									</CheckboxPrimitive.Root>

									<Button
										type="button"
										variant="ghost"
										className="h-auto rounded-none px-0 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-950 hover:bg-transparent hover:text-zinc-600"
										disabled={!onAddToCart || isInCart?.(product) || isOutOfStock?.(product)}
										aria-label={
											isOutOfStock?.(product)
												? "Out of stock"
												: isInCart?.(product)
													? "Already in cart"
													: "Add to cart"
										}
										onClick={(e) => {
											e.stopPropagation()
											onAddToCart?.(product)
										}}
									>
										{isOutOfStock?.(product)
											? "Sold out"
											: isInCart?.(product)
												? "Added"
												: (
													<span className="inline-flex items-center gap-2">
														Add to cart
														<ShoppingCartIcon className="size-3.5" />
													</span>
												)}
									</Button>
								</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default ProductList
