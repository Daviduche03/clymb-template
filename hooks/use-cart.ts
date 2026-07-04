import { useCallback, useEffect, useMemo, useState } from "react"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-types"
import { getCart, addToCart, updateCartItem, deleteCartItem, getStore, StoreApiError } from "@/lib/api/store-client"

const CART_SESSION_KEY_PREFIX = "storefront_cart_session_v1"
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

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

function migrateSessionToken(fromStoreId: string, toStoreId: string) {
  if (typeof window === "undefined") return getOrCreateSessionToken(toStoreId)
  if (fromStoreId === toStoreId) return getOrCreateSessionToken(toStoreId)

  const oldKey = sessionKeyForStore(fromStoreId)
  const newKey = sessionKeyForStore(toStoreId)
  const oldToken = window.localStorage.getItem(oldKey)
  const newToken = window.localStorage.getItem(newKey)

  if (oldToken && !newToken) {
    window.localStorage.setItem(newKey, oldToken)
    window.localStorage.removeItem(oldKey)
    return oldToken
  }

  return getOrCreateSessionToken(toStoreId)
}

async function resolveCartStoreId(storeId: string): Promise<string> {
  if (storeId === "default") return storeId
  if (!UUID_RE.test(storeId)) return storeId

  try {
    const store = await getStore(storeId)
    return store.slug
  } catch {
    return storeId
  }
}

function mapItemsToRecord(items: ShoppingCartLine[]) {
  const record: Record<string, ShoppingCartLine> = {}
  for (const item of items) {
    record[item.id] = item
  }
  return record
}

export function useCart(storeId: string = "default") {
  const [cartStoreId, setCartStoreId] = useState<string | null>(null)
  const [lines, setLines] = useState<Record<string, ShoppingCartLine>>({})
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)

  const hydrateCart = useCallback(async (targetStoreId: string, token: string) => {
    const data = await getCart(targetStoreId, token)
    setLines(mapItemsToRecord(data.items ?? []))
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setIsLoaded(false)
      const resolvedStoreId = await resolveCartStoreId(storeId)
      const token = migrateSessionToken(storeId, resolvedStoreId)

      if (cancelled) return

      setCartStoreId(resolvedStoreId)
      setSessionToken(token)

      try {
        await hydrateCart(resolvedStoreId, token)
      } catch {
        if (!cancelled) setLines({})
      } finally {
        if (!cancelled) setIsLoaded(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [storeId, hydrateCart])

  const activeStoreId = cartStoreId ?? storeId

  const cartCount = useMemo(
    () => Object.values(lines).reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const cartTotal = useMemo(
    () => Object.values(lines).reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  )

  const addToCartHandler = useCallback(async (line: ShoppingCartLine) => {
    const resolvedStoreId = cartStoreId ?? (await resolveCartStoreId(storeId))
    const token = sessionToken ?? migrateSessionToken(storeId, resolvedStoreId)

    try {
      setCartError(null)
      await addToCart(resolvedStoreId, {
        sessionToken: token,
        productId: line.productId || line.id,
        quantity: line.quantity,
        variantId: line.variantId || "default",
      })
      const data = await getCart(resolvedStoreId, token)
      setSessionToken(token)
      setCartStoreId(resolvedStoreId)
      setLines(mapItemsToRecord(data.items ?? []))
    } catch (error) {
      const message = error instanceof StoreApiError ? error.message : "Could not add to cart"
      setCartError(message)
      throw error
    }
  }, [cartStoreId, sessionToken, storeId])

  const setLineQty = useCallback(async (id: string, quantity: number) => {
    const token = sessionToken
    if (!token) return

    const existing = lines[id]
    const itemId = existing?.cartItemId
    if (!itemId) return

    try {
      setCartError(null)
      if (quantity === 0) {
        await deleteCartItem(activeStoreId, token, itemId)
        setLines((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        return
      }

      await updateCartItem(activeStoreId, token, itemId, quantity)
      setLines((prev) => ({
        ...prev,
        [id]: { ...prev[id], quantity },
      }))
    } catch (error) {
      const message = error instanceof StoreApiError ? error.message : "Could not update cart"
      setCartError(message)
    }
  }, [activeStoreId, lines, sessionToken])

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
    cartStoreId: activeStoreId,
    sessionToken,
    cartError,
    clearCartError: () => setCartError(null),
  }
}
