"use client"

import { useState } from "react"
import type { ShoppingCartLine, ShoppingCartLineProps } from "@/lib/types"

export const demoCartItem = {
  id: "demo",
  name: "Apple AirPods Pro (2nd gen)",
  category: "Headphones",
  variantTitle: "White",
  image:
    "https://images.unsplash.com/photo-1624258919367-5dc28f5dc293?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160",
  price: 129,
  quantity: 1,
}

export function useCartLineState({ line, onQuantityChange }: ShoppingCartLineProps) {
  const [internalQty, setInternalQty] = useState(demoCartItem.quantity)
  const controlled = line != null && onQuantityChange != null

  const item: ShoppingCartLine = controlled
    ? line
    : {
        id: demoCartItem.id,
        name: demoCartItem.name,
        category: demoCartItem.category,
        variantTitle: demoCartItem.variantTitle,
        image: demoCartItem.image,
        price: demoCartItem.price,
        quantity: internalQty,
      }

  const increment = () => {
    if (controlled) onQuantityChange!(item.quantity + 1)
    else setInternalQty((q) => q + 1)
  }

  const decrement = () => {
    if (controlled) onQuantityChange!(Math.max(1, item.quantity - 1))
    else setInternalQty((q) => Math.max(1, q - 1))
  }

  return { item, controlled, increment, decrement }
}

export function formatLineMeta(item: ShoppingCartLine) {
  if (item.variantTitle) return item.variantTitle
  if (item.category && item.category !== "Wearable") return item.category
  return null
}

export function formatMoney(amount: number, currency = "$") {
  return `${currency}${amount.toFixed(2)}`
}
