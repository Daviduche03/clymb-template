"use client";

import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductCardProps } from "./product-card-01";

export function ProductCardThree({
	name,
	description,
	price,
	image,
	isFavorited = false,
	isInCart = false,
	isOutOfStock = false,
	lowStockText,
	onAddToCart,
	onClick,
	className,
}: ProductCardProps) {
	return (
		<Card
			className={cn(
				"not-prose w-full max-w-[340px] overflow-hidden rounded-2xl border-0 bg-white p-0 gap-0 shadow-none",
				className,
			)}
			onClick={onClick}
		>
			<CardContent className="space-y-1.5 p-4">
				<div className="overflow-hidden rounded-xl bg-zinc-100">
					<img src={image} alt={name} className="aspect-square w-full object-cover" />
				</div>

				<div className="space-y-0.5">
					<CardTitle className="text-base font-semibold leading-tight">{name}</CardTitle>
					{isOutOfStock ? (
						<CardDescription className="text-xs text-rose-600">Out of stock</CardDescription>
					) : lowStockText ? (
						<CardDescription className="text-xs text-amber-600">{lowStockText}</CardDescription>
					) : null}
					{description ? (
						<CardDescription className="line-clamp-2 text-sm text-zinc-600">
							{description}
						</CardDescription>
					) : null}
				</div>

				<div className="flex items-center justify-between pt-0.5">
					<span className="rounded-md bg-zinc-100 px-2 py-0.5 text-sm font-semibold text-zinc-700">
						${price.toFixed(2)}
					</span>

					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							className="rounded-full p-0"
							onClick={(e) => e.stopPropagation()}
						>
							<Heart
								className={cn(
									"size-4 transition-colors",
									isFavorited ? "fill-red-500 text-red-500" : "text-zinc-600",
								)}
							/>
						</Button>
						<Button
							type="button"
							variant={isInCart || isOutOfStock ? "secondary" : "ghost"}
							size="icon-sm"
							className="rounded-full p-0"
							disabled={isInCart || isOutOfStock}
							onClick={(e) => {
								e.stopPropagation();
								onAddToCart?.();
							}}
						>
							<ShoppingCart className="size-4 text-zinc-700" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
