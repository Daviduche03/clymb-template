"use client"

import Link from "next/link"

import { HeartIcon, ShoppingCartIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

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
	variant?: "grid-01" | "grid-02"
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
	variant = "grid-01",
	onProductClick,
	onAddToCart,
	isWishlisted,
	onToggleWishlist,
	isInCart,
	isOutOfStock,
	isLowStock,
}: ProductProps) => {
	return (
		<section className={cn("bg-white", compact ? "py-4 sm:py-6" : "py-14 sm:py-20 lg:py-24")}>
			<div
				className={cn(
					"mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					compact ? "space-y-6 sm:space-y-8 lg:space-y-10" : "space-y-14 sm:space-y-16 lg:space-y-20",
				)}
			>
					<div className={cn(compact ? "space-y-2" : "space-y-4")}>
						{badge && <p className="text-[0.72rem] uppercase tracking-[0.24em] text-zinc-500">{badge}</p>}
						<h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl lg:text-4xl">{title}</h2>
					</div>

				<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3", variant === "grid-02" ? "gap-x-4 gap-y-12" : "gap-x-5 gap-y-10")}>
					{products.map((product, index) => (
						<article key={index} className="group relative">
							<div className={cn("relative overflow-hidden bg-zinc-100", variant === "grid-02" ? "rounded-none" : "")}>
								{product.href ? (
									<Link href={product.href} className="block w-full">
										<div className={cn("w-full overflow-hidden bg-zinc-100", variant === "grid-02" ? "aspect-[0.78]" : "aspect-[4/5]")}>
											<img
												src={product.image}
												alt={product.imgAlt}
												className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
											/>
										</div>
									</Link>
								) : onProductClick ? (
									<button
										type="button"
										className="block w-full text-left"
										onClick={() => onProductClick(product)}
									>
										<div className={cn("w-full overflow-hidden bg-zinc-100", variant === "grid-02" ? "aspect-[0.78]" : "aspect-[4/5]")}>
											<img
												src={product.image}
												alt={product.imgAlt}
												className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
											/>
										</div>
									</button>
								) : (
									<div className={cn("w-full overflow-hidden bg-zinc-100", variant === "grid-02" ? "aspect-[0.78]" : "aspect-[4/5]")}>
										<img
											src={product.image}
											alt={product.imgAlt}
											className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
										/>
									</div>
								)}

								{onToggleWishlist ? (
									<div className={cn("absolute right-3 top-3 transition-opacity duration-200", variant === "grid-02" ? "opacity-0 group-hover:opacity-100" : "opacity-100 sm:opacity-0 sm:group-hover:opacity-100")}>
										<CheckboxPrimitive.Root
											data-slot="checkbox"
											className={cn(
												"group/heart flex items-center justify-center text-zinc-900 outline-none transition hover:bg-white",
												variant === "grid-02"
													? "h-8 w-8 rounded-full bg-white/88 backdrop-blur-sm"
													: "h-9 w-9 rounded-full bg-white/92 backdrop-blur-sm",
											)}
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

								{onAddToCart ? (
									<div className={cn("pointer-events-none absolute inset-x-3 bottom-3 flex justify-start transition-all duration-200", variant === "grid-02" ? "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" : "opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100")}>
										<button
											type="button"
											className={cn(
												"pointer-events-auto inline-flex items-center gap-2 bg-white font-medium uppercase text-zinc-950 transition hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:bg-white disabled:text-zinc-400",
												variant === "grid-02"
													? "h-10 px-4 text-[0.65rem] tracking-[0.24em]"
													: "h-9 px-3 text-[0.68rem] tracking-[0.22em] shadow-sm",
											)}
											disabled={isInCart?.(product) || isOutOfStock?.(product)}
											aria-label={
												isOutOfStock?.(product)
													? "Out of stock"
													: isInCart?.(product)
														? "Already in cart"
														: "Add to cart"
											}
											onClick={(e) => {
												e.stopPropagation()
												onAddToCart(product)
											}}
										>
											<ShoppingCartIcon className="size-3.5" />
											<span>{isOutOfStock?.(product) ? "Sold out" : isInCart?.(product) ? "Added" : "Quick add"}</span>
										</button>
									</div>
								) : null}
							</div>

							<div className={cn("pt-4", variant === "grid-02" ? "space-y-1.5" : "space-y-2")}>
								{variant === "grid-01" ? (
									<p className="text-[0.66rem] uppercase tracking-[0.22em] text-zinc-500">
										{product.badges[0] ?? "Collection"}
									</p>
								) : null}
								{product.href ? (
									<Link href={product.href} className="block text-left">
										<h3 className={cn("line-clamp-2 text-zinc-950", variant === "grid-02" ? "text-[0.98rem] font-normal tracking-[-0.02em]" : "text-[1.03rem] font-medium tracking-[-0.03em]")}>
											{product.name}
										</h3>
									</Link>
								) : onProductClick ? (
									<button
										type="button"
										className="block text-left"
										onClick={() => onProductClick(product)}
									>
										<h3 className={cn("line-clamp-2 text-zinc-950", variant === "grid-02" ? "text-[0.98rem] font-normal tracking-[-0.02em]" : "text-[1.03rem] font-medium tracking-[-0.03em]")}>
											{product.name}
										</h3>
									</button>
								) : (
									<h3 className={cn("line-clamp-2 text-zinc-950", variant === "grid-02" ? "text-[0.98rem] font-normal tracking-[-0.02em]" : "text-[1.03rem] font-medium tracking-[-0.03em]")}>
										{product.name}
									</h3>
								)}

								<div className={cn("flex flex-wrap items-center text-zinc-950", variant === "grid-02" ? "gap-1.5 text-[0.92rem]" : "gap-2 text-[0.95rem]")}>
									<span className={cn(variant === "grid-02" ? "font-normal" : "font-medium")}>
										${(product.salePrice ?? product.price).toFixed(2)}
									</span>
									{product.salePrice ? (
										<span className="text-sm text-zinc-400 line-through">${product.price.toFixed(2)}</span>
									) : null}
								</div>

								{isOutOfStock?.(product) ? (
									<p className="text-[0.68rem] uppercase tracking-[0.18em] text-zinc-400">Sold out</p>
								) : isLowStock?.(product) && variant === "grid-01" ? (
									<p className="text-[0.68rem] uppercase tracking-[0.18em] text-zinc-500">Low stock</p>
								) : null}
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	)
}

export default ProductList
