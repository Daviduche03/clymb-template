"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const legacy = {
	name: "Man Black Cotton T-Shirt",
	description:
		"A comfortable and durable cotton t-shirt for men. Gives you a perfect fit and a great look for every occasion.",
	category: "Clothing",
	currency: "$",
	originalPrice: 25.4,
	discount: 6,
	images: [
		"https://images.unsplash.com/photo-1502389614483-e475fc34407e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
		"https://images.unsplash.com/photo-1618453292459-53424b66bb6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
		"https://images.unsplash.com/photo-1618453292507-4959ece6429e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
		"https://images.unsplash.com/photo-1617984102437-a4aa52284d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
	],
	sizes: ["S", "M", "L", "XL", "XXL"],
	stockMessage: "Last 1 left - make it yours!",
}

export type ProductDetailModel = {
	name: string
	description: string
	category: string
	images: string[]
	sizes: string[]
	currency: string
	/** Price shown as the main (sale) price */
	currentPrice: number
	/** Optional list / MSRP price */
	compareAtPrice?: number
	stockMessage?: string
}

const defaultModel: ProductDetailModel = {
	name: legacy.name,
	description: legacy.description,
	category: legacy.category,
	images: legacy.images,
	sizes: legacy.sizes,
	currency: legacy.currency,
	currentPrice: legacy.originalPrice - legacy.discount,
	compareAtPrice: legacy.originalPrice,
	stockMessage: legacy.stockMessage,
}

export type ProductDetailOneProps = {
	/** When omitted, shows the built-in demo product. */
	product?: ProductDetailModel | null
	onAddToCart?: (quantity: number, size?: string) => void
	className?: string
	variant?: "editorial" | "split"
}

export function ProductDetailOne({ product, onAddToCart, className, variant = "editorial" }: ProductDetailOneProps) {
	const model = product ?? defaultModel
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [selectedSize, setSelectedSize] = useState(model.sizes[0] ?? "S")
	const [quantity, setQuantity] = useState(1)
	const [didAdd, setDidAdd] = useState(false)

	const images = model.images
	const len = Math.max(images.length, 1)

	const nextImage = () => {
		setCurrentImageIndex((prev) => (prev + 1) % len)
	}

	const prevImage = () => {
		setCurrentImageIndex((prev) => (prev - 1 + len) % len)
	}

	const incrementQuantity = () => setQuantity((prev) => prev + 1)
	const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

	useEffect(() => {
		if (!didAdd) return
		const timeout = window.setTimeout(() => setDidAdd(false), 1600)
		return () => window.clearTimeout(timeout)
	}, [didAdd])

	return (
		<div className={cn("not-prose w-full max-w-6xl mx-auto p-4 sm:p-6", className)}>
			<div className={cn("grid grid-cols-1 gap-10 lg:gap-12", variant === "split" ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-2")}>
				<div className="flex gap-2">
					<div className="flex w-24 flex-col gap-2 sm:w-28">
						{images.map((image, index) => (
							<button
								key={index}
								type="button"
								onClick={() => setCurrentImageIndex(index)}
								className={cn(
									"aspect-square overflow-hidden rounded-lg border-2 bg-gray-100 transition-colors",
									currentImageIndex === index
										? "border-gray-900"
										: "border-transparent",
								)}
							>
								<img
									src={image}
									alt={`${model.name} ${index + 1}`}
									className="h-full w-full object-cover"
								/>
							</button>
						))}
					</div>

					<div className="relative aspect-3/4 flex-1 overflow-hidden rounded-lg bg-gray-100">
						<img
							src={images[currentImageIndex]}
							alt={model.name}
							className="h-full w-full object-cover"
						/>

						{len > 1 && (
							<>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
									onClick={prevImage}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
									onClick={nextImage}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</>
						)}
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<p className="text-muted-foreground mb-2 text-sm font-medium">{model.category}</p>
						<h1 className="text-3xl font-bold">{model.name}</h1>
						<p className="text-muted-foreground mt-2">{model.description}</p>
						{model.stockMessage ? (
							<p className="text-muted-foreground mt-2 text-sm">{model.stockMessage}</p>
						) : null}
					</div>

					<div className="flex flex-wrap items-end gap-2">
						<p className="text-3xl font-bold">
							{model.currency}
							{model.currentPrice.toFixed(2)}
						</p>
						{model.compareAtPrice != null ? (
							<p className="text-2xl font-medium text-gray-400 line-through">
								{model.currency}
								{model.compareAtPrice.toFixed(2)}
							</p>
						) : null}
					</div>

					<div>
						<h3 className="mb-2 text-sm font-medium">Size</h3>
						<div className="flex flex-wrap gap-2">
							{model.sizes.map((size) => (
								<Button
									key={size}
									type="button"
									variant={selectedSize === size ? "default" : "outline"}
									size="sm"
									onClick={() => setSelectedSize(size)}
								>
									{size}
								</Button>
							))}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center rounded-lg border border-gray-300">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-lg hover:bg-gray-100"
								onClick={decrementQuantity}
							>
								<Minus className="h-4 w-4" />
							</Button>
							<span className="w-12 text-center font-medium">{quantity}</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-10 w-10 rounded-lg hover:bg-gray-100"
								onClick={incrementQuantity}
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
						<Button
							type="button"
							size="lg"
							onClick={() => {
								onAddToCart?.(quantity, selectedSize)
								if (onAddToCart) setDidAdd(true)
							}}
						>
							{didAdd ? "Added to cart" : "Add to cart"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
