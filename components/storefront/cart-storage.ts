"use client"

import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import { CART_STORAGE_KEY } from "@/lib/storefront-data"

function keyForStore(storeId: string) {
  return `${CART_STORAGE_KEY}:${storeId}`
}

export function loadCart(storeId = "default"): Record<string, ShoppingCartLine> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(keyForStore(storeId))
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, ShoppingCartLine>
    return parsed ?? {}
  } catch {
    return {}
  }
}

export function saveCart(lines: Record<string, ShoppingCartLine>, storeId = "default") {
  if (typeof window === "undefined") return
  window.localStorage.setItem(keyForStore(storeId), JSON.stringify(lines))
}
