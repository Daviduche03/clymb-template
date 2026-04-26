"use client"

import {
	Card,
	CardTitle,
	CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

const demoItem = {
	id: "demo",
	name: "Apple AirPods Pro (2nd gen)",
	category: "Headphones",
	image:
		"https://images.unsplash.com/photo-1624258919367-5dc28f5dc293?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160",
	price: 129.0,
	quantity: 1,
}

export type ShoppingCartLine = {
	id: string
	name: string
	category: string
	image: string
	price: number
	quantity: number
	variantId?: string
	variantTitle?: string
	sku?: string
	currency?: string
}

export type ShoppingCartOneProps = {
	/** Controlled line (store mode). Omit to use the built-in demo cart. */
	line?: ShoppingCartLine
	onQuantityChange?: (quantity: number) => void
	onRemove?: () => void
}

export function ShoppingCartOne({ line, onQuantityChange, onRemove }: ShoppingCartOneProps) {
	const [internalQty, setInternalQty] = useState(demoItem.quantity)
	const controlled = line != null && onQuantityChange != null

	const item = controlled
		? line
		: {
				id: demoItem.id,
				name: demoItem.name,
				category: demoItem.category,
				image: demoItem.image,
				price: demoItem.price,
				quantity: internalQty,
			}

	const quantity = item.quantity

	const incrementQuantity = () => {
		if (controlled) onQuantityChange!(quantity + 1)
		else setInternalQty((q) => q + 1)
	}

	const decrementQuantity = () => {
		if (controlled) onQuantityChange!(Math.max(1, quantity - 1))
		else setInternalQty((q) => Math.max(1, q - 1))
	}

	return (
		<Card className="not-prose flex w-full max-w-[480px] flex-row gap-4 rounded-xl border-0 bg-muted p-4 shadow-none">
			<div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
				<img src={item.image} alt={item.name} className="h-full w-full object-cover" />
			</div>
			<div className="flex flex-1 flex-col space-y-4">
				<div className="flex gap-4">
					<div className="flex-1">
						<CardDescription>{item.category}</CardDescription>
						<CardTitle>{item.name}</CardTitle>
					</div>

					<Button
						type="button"
						size="icon"
						variant="ghost"
						onClick={() => {
							if (controlled) onRemove?.()
						}}
						disabled={!controlled}
						aria-label="Remove item"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center justify-between">
					<div className="text-foreground flex items-center rounded-lg border border-gray-200 bg-background">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-lg hover:bg-muted"
							onClick={decrementQuantity}
						>
							<Minus className="h-4 w-4" />
						</Button>
						<span className="w-8 text-center text-sm font-medium">{quantity}</span>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-lg hover:bg-muted"
							onClick={incrementQuantity}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<p className="text-xl font-semibold">${(item.price * quantity).toFixed(2)}</p>
				</div>
			</div>
		</Card>
	)
}
