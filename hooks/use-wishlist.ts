import { useCallback, useEffect, useMemo, useState } from "react"

const WISHLIST_KEY_PREFIX = "storefront_wishlist_v1"

function loadWishlist(storeId: string): Set<string> {
  if (typeof window === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(`${WISHLIST_KEY_PREFIX}_${storeId}`)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set()
  }
}

function saveWishlist(slugs: Set<string>, storeId: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(`${WISHLIST_KEY_PREFIX}_${storeId}`, JSON.stringify([...slugs]))
}

export function useWishlist(storeId: string = "default") {
  const [slugs, setSlugs] = useState<Set<string>>(() => loadWishlist(storeId))
  const isLoaded = true

  useEffect(() => {
    saveWishlist(slugs, storeId)
  }, [slugs, storeId, isLoaded])

  const isWishlisted = useCallback((slug: string) => slugs.has(slug), [slugs])

  const toggleWishlist = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }, [])

  const wishlistCount = useMemo(() => slugs.size, [slugs])

  return {
    isWishlisted,
    toggleWishlist,
    wishlistCount,
    isLoaded,
  }
}
