import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ProductCardProps {
	id?: string;
	name: string;
	description?: string;
	category?: string;
	price: number;
	image: string;
	isFavorited?: boolean;
	isInCart?: boolean;
	isOutOfStock?: boolean;
	lowStockText?: string;
	onAddToCart?: () => void;
	onClick?: () => void;
	className?: string;
}

export function ProductCardOne({
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
			className={cn("w-full max-w-[320px] cursor-pointer overflow-hidden border-0 p-0 gap-0 shadow-none", className)}
			onClick={onClick}
		>
			<CardContent className="p-3 space-y-2.5">
				{/* Product Image */}
				<div className="relative">
					<div className="bg-gray-100 rounded-2xl flex items-center justify-center h-[260px] relative overflow-hidden">
						<img
							src={image}
							alt={name}
							className="w-full h-full object-cover"
						/>

						<Button
							variant="ghost"
							size="icon"
							className="absolute top-2 right-2"
							onClick={(e) => {
								e.stopPropagation();
								// handle favorite toggle
							}}
						>
							<Heart
								className={cn(
									"w-6 h-6 transition-colors",
									isFavorited
										? "fill-red-500 text-red-500"
										: "text-gray-800 hover:text-red-500",
								)}
							/>
						</Button>
					</div>
				</div>

				{/* Product Info */}
				<div>
					<CardTitle className="mb-1 text-xl leading-tight">
						{name}
					</CardTitle>
					{isOutOfStock ? (
						<CardDescription className="text-xs text-rose-600">Out of stock</CardDescription>
					) : lowStockText ? (
						<CardDescription className="text-xs text-amber-600">{lowStockText}</CardDescription>
					) : null}
					{description && (
						<CardDescription className="text-sm line-clamp-2">
							{description}
						</CardDescription>
					)}
				</div>

				<div className="flex items-center justify-between pt-0.5">
					<p className="text-2xl font-bold">${price.toFixed(2)}</p>

					<Button 
						disabled={isInCart || isOutOfStock}
						onClick={(e) => {
							e.stopPropagation();
							onAddToCart?.();
						}}
					>
						{isOutOfStock ? "Out of stock" : isInCart ? "Added" : "Add to Cart"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
