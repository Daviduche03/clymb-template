import { useState } from "react"
import type { ShoppingCartLine, ShoppingCartLineProps } from "@/components/commercn/carts/cart-types"
import { demoCartItem } from "@/components/commercn/carts/cart-types"

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
