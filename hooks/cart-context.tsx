"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { ShoppingCartLine } from "@/lib/types"
import { getCart, addToCart as apiAddToCart, updateCartItem, deleteCartItem, getStore, StoreApiError } from "@/lib/api/store-client"

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

type CartContextValue = {
  lines: Record<string, ShoppingCartLine>
  cartCount: number
  cartTotal: number
  addToCart: (line: ShoppingCartLine) => Promise<void>
  setLineQty: (id: string, quantity: number) => Promise<void>
  removeLine: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  isLoaded: boolean
  cartStoreId: string | null
  setStoreId: (storeId: string) => void
  sessionToken: string | null
  cartError: string | null
  clearCartError: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Record<string, ShoppingCartLine>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [sessionToken, setSessionToken] = useState<string | null>(null)
  const [cartStoreId, setCartStoreId] = useState<string | null>(null)
  const [cartError, setCartError] = useState<string | null>(null)
  const [targetStoreId, setTargetStoreId] = useState<string | null>(null)

  const setStoreId = useCallback((storeId: string) => {
    setTargetStoreId((prev) => (prev === storeId ? prev : storeId))
  }, [])

  const hydrateCart = useCallback(async (targetStoreId: string, token: string) => {
    const data = await getCart(targetStoreId, token)
    setLines(mapItemsToRecord(data.items ?? []))
  }, [])

  useEffect(() => {
    void (async () => {
      const storeId = targetStoreId ?? "default"
      setIsLoaded(false)
      const resolvedStoreId = await resolveCartStoreId(storeId)
      const token = migrateSessionToken(storeId, resolvedStoreId)
      setCartStoreId(resolvedStoreId)
      setSessionToken(token)
      try {
        await hydrateCart(resolvedStoreId, token)
      } catch {
        setLines({})
      } finally {
        setIsLoaded(true)
      }
    })()
  }, [targetStoreId, hydrateCart])

  const activeStoreId = cartStoreId ?? targetStoreId ?? "default"

  const cartCount = useMemo(
    () => Object.values(lines).reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const cartTotal = useMemo(
    () => Object.values(lines).reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  )

  const addToCart = useCallback(async (line: ShoppingCartLine) => {
    const resolvedStoreId = cartStoreId ?? (await resolveCartStoreId(targetStoreId ?? "default"))
    const token = sessionToken ?? migrateSessionToken(targetStoreId ?? "default", resolvedStoreId)
    try {
      setCartError(null)
      await apiAddToCart(resolvedStoreId, {
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
  }, [cartStoreId, sessionToken, targetStoreId])

  const setLineQty = useCallback(async (id: string, quantity: number) => {
    const token = sessionToken
    const storeId = cartStoreId ?? targetStoreId ?? "default"
    if (!token) return
    const existing = lines[id]
    const itemId = existing?.cartItemId
    if (!itemId) return
    try {
      setCartError(null)
      if (quantity === 0) {
        await deleteCartItem(storeId, token, itemId)
        setLines((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        return
      }
      await updateCartItem(storeId, token, itemId, quantity)
      setLines((prev) => ({
        ...prev,
        [id]: { ...prev[id], quantity },
      }))
    } catch (error) {
      const message = error instanceof StoreApiError ? error.message : "Could not update cart"
      setCartError(message)
    }
  }, [sessionToken, cartStoreId, targetStoreId, lines])

  const removeLine = useCallback(async (id: string) => {
    await setLineQty(id, 0)
  }, [setLineQty])

  const clearCart = useCallback(async () => {
    const currentIds = Object.keys(lines)
    for (const id of currentIds) {
      await setLineQty(id, 0)
    }
  }, [lines, setLineQty])

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      cartCount,
      cartTotal,
      addToCart,
      setLineQty,
      removeLine,
      clearCart,
      isLoaded,
      cartStoreId,
      setStoreId,
      sessionToken,
      cartError,
      clearCartError: () => setCartError(null),
    }),
    [lines, cartCount, cartTotal, addToCart, setLineQty, removeLine, clearCart, isLoaded, cartStoreId, sessionToken, cartError],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(storeId?: string) {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  useEffect(() => {
    if (storeId) context.setStoreId(storeId)
  }, [storeId, context.setStoreId])
  return context
}