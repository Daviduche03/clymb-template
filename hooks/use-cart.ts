import { useCallback, useEffect, useMemo, useState } from "react"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
type CartApiSnapshot = {
  items: ShoppingCartLine[]
}

const CART_SESSION_KEY_PREFIX = "storefront_cart_session_v1"

function sessionKeyForStore(storeId: string) {
  return `${CART_SESSION_KEY_PREFIX}:${storeId}`
}

function createSessionToken(storeId: string) {
  const random = Math.random().toString(36).slice(2, 10)
  return `cart-${storeId}-${Date.now()}-${random}`
}

function getOrCreateSessionToken(storeId: string) {
  if (typeof window === "undefined") return createSessionToken(storeId)
  const key = sessionKeyForStore(storeId)
  const existing = window.localStorage.getItem(key)
  if (existing) return existing
  const created = createSessionToken(storeId)
  window.localStorage.setItem(key, created)
  return created
}

function mapItemsToRecord(items: ShoppingCartLine[]) {
  const record: Record<string, ShoppingCartLine> = {}
  for (const item of items) {
    record[item.id] = item
  }
  return record
}

export function useCart(storeId: string = "default") {
  const [lines, setLines] = useState<Record<string, ShoppingCartLine>>({})
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const hydrateCart = useCallback(async (targetStoreId: string, token: string) => {
    const response = await fetch(
      `/api/cart?store=${encodeURIComponent(targetStoreId)}&sessionToken=${encodeURIComponent(token)}`,
      { cache: "no-store" },
    )
    if (!response.ok) {
      throw new Error("Failed to load cart.")
    }
    const payload = (await response.json()) as { cart: CartApiSnapshot | null }
    setLines(mapItemsToRecord(payload.cart?.items ?? []))
  }, [])

  useEffect(() => {
    let cancelled = false
    const token = getOrCreateSessionToken(storeId)
    setSessionToken(token)

    hydrateCart(storeId, token)
      .catch(() => {
        if (!cancelled) setLines({})
      })
      .finally(() => {
        if (!cancelled) setIsLoaded(true)
      })

    return () => {
      cancelled = true
    }
  }, [storeId, hydrateCart])

  const cartCount = useMemo(
    () => Object.values(lines).reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const cartTotal = useMemo(
    () => Object.values(lines).reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  )

  const addToCart = useCallback(async (line: ShoppingCartLine) => {
    if (!sessionToken) return
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeSlug: storeId,
        sessionToken,
        productSlug: line.id,
        quantity: line.quantity,
        variantId: line.variantId,
        variantTitle: line.variantTitle,
      }),
    })

    if (!response.ok) return
    const payload = (await response.json()) as { cart: CartApiSnapshot | null }
    setLines(mapItemsToRecord(payload.cart?.items ?? []))
  }, [sessionToken, storeId])

  const setLineQty = useCallback(async (id: string, quantity: number) => {
    if (!sessionToken) return
    const existing = lines[id]
    if (!existing?.variantId) return

    const response = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken,
        variantId: existing.variantId,
        quantity,
      }),
    })

    if (!response.ok) return
    const payload = (await response.json()) as { cart: CartApiSnapshot | null }
    setLines(mapItemsToRecord(payload.cart?.items ?? []))
  }, [lines, sessionToken])

  const removeLine = useCallback(async (id: string) => {
    await setLineQty(id, 0)
  }, [setLineQty])

  const clearCart = useCallback(async () => {
    const currentIds = Object.keys(lines)
    for (const id of currentIds) {
      await setLineQty(id, 0)
    }
  }, [lines, setLineQty])

  return {
    lines,
    cartCount,
    cartTotal,
    addToCart,
    setLineQty,
    removeLine,
    clearCart,
    isLoaded,
  }
}
