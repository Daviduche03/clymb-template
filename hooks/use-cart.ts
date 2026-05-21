import { useCallback, useEffect, useMemo, useState } from "react"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import { getCart, addToCart, updateCartItem, deleteCartItem } from "@/lib/api/store-client"

type CartApiData = {
  cart: { id: string } | null
  items: ShoppingCartLine[]
  subtotal: number
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
    const data = await getCart(targetStoreId, token)
    setLines(mapItemsToRecord(data.items ?? []))
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

  const addToCartHandler = useCallback(async (line: ShoppingCartLine) => {
    if (!sessionToken) return
    try {
      await addToCart(storeId, {
        sessionToken,
        productId: line.productId || line.id,
        quantity: line.quantity,
        variantId: line.variantId || "default",
      })
      const data = await getCart(storeId, sessionToken)
      setLines(mapItemsToRecord(data.items ?? []))
    } catch {}
  }, [sessionToken, storeId])

  const setLineQty = useCallback(async (id: string, quantity: number) => {
    if (!sessionToken) return
    const existing = lines[id]
    const itemId = existing?.cartItemId || existing?.variantId
    if (!itemId) return

    try {
      if (quantity === 0) {
        await deleteCartItem(storeId, sessionToken, itemId)
        setLines((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        return
      }

      await updateCartItem(storeId, sessionToken, itemId, quantity)
      setLines((prev) => ({
        ...prev,
        [id]: { ...prev[id], quantity },
      }))
    } catch {}
  }, [lines, sessionToken, storeId])

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
    addToCart: addToCartHandler,
    setLineQty,
    removeLine,
    clearCart,
    isLoaded,
  }
}
