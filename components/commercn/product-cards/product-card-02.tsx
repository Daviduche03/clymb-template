"use client";

import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ProductCardProps } from "./product-card-01";

export function ProductCardTwo({
	name,
	category,
	price,
	image,
	isFavorited: initialFavorited = false,
	isInCart = false,
	isOutOfStock = false,
	lowStockText,
	onAddToCart,
	onClick,
	className,
}: ProductCardProps) {
	const [isFavorited, setIsFavorited] = useState(initialFavorited);

	return (
		<Card
			className={cn(
				"not-prose mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl border-0 p-0 gap-0 cursor-pointer shadow-none",
				className
			)}
			onClick={onClick}
		>
			<CardContent className="p-0 overflow-hidden">
				{/* Product Image */}
				<div className="relative aspect-square overflow-hidden">
					<img
						src={image}
						alt={name}
						className="w-full h-full object-cover"
					/>
				</div>

				{/* Product Info */}
				<div className="relative z-10 rounded-t-2xl bg-card p-3 -mt-3">
					{/* Name and Verification */}
					<div className="mb-2 flex items-center justify-between gap-2">
						<div className="truncate">
							<CardTitle className="truncate text-base">{name}</CardTitle>
							<CardDescription className="text-xs capitalize">{category || "Product"}</CardDescription>
							{isOutOfStock ? (
								<CardDescription className="text-xs text-rose-600">Out of stock</CardDescription>
							) : lowStockText ? (
								<CardDescription className="text-xs text-amber-600">{lowStockText}</CardDescription>
							) : null}
						</div>

						<p className="shrink-0 text-lg font-semibold">${price.toFixed(2)}</p>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-between gap-1.5">
						<Button 
							size="sm"
							className="h-8 flex-1 text-xs"
							disabled={isInCart || isOutOfStock}
							onClick={(e) => {
								e.stopPropagation();
								onAddToCart?.();
							}}
						>
							{isOutOfStock ? "Out of stock" : isInCart ? "Added" : "Add to Cart"}
						</Button>
						<Button
							size="icon-sm"
							variant="outline"
							className="h-8 w-8"
							onClick={(e) => {
								e.stopPropagation();
								setIsFavorited(!isFavorited);
							}}
						>
							<Heart
								className={cn(
									"size-4 transition-colors",
									isFavorited
										? "fill-red-500 text-red-500"
										: "text-muted-foreground hover:text-red-500",
								)}
							/>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
