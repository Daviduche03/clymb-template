import { useCallback, useEffect, useMemo, useState } from "react"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import { loadCart, saveCart } from "@/components/storefront/cart-storage"

export function useCart(storeId: string = "default") {
  const [lines, setLines] = useState<Record<string, ShoppingCartLine>>(() => loadCart(storeId))
  const isLoaded = true

  useEffect(() => {
    saveCart(lines, storeId)
  }, [lines, storeId, isLoaded])

  const cartCount = useMemo(
    () => Object.values(lines).reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  const cartTotal = useMemo(
    () => Object.values(lines).reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  )

  const addToCart = useCallback((line: ShoppingCartLine) => {
    setLines((prev) => {
      const prevLine = prev[line.id]
      const nextQty = (prevLine?.quantity ?? 0) + line.quantity
      return {
        ...prev,
        [line.id]: {
          ...line,
          quantity: nextQty,
        },
      }
    })
  }, [])

  const setLineQty = useCallback((id: string, quantity: number) => {
    setLines((prev) => {
      const next = { ...prev }
      if (quantity < 1) {
        delete next[id]
        return next
      }
      const row = next[id]
      if (!row) return prev
      next[id] = { ...row, quantity }
      return next
    })
  }, [])

  const removeLine = useCallback((id: string) => {
    setLines((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setLines({})
  }, [])

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
