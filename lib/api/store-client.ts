import type {
  StoreProduct,
  StorefrontConfig,
  StorefrontVariants,
} from "@/lib/types"
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"

const API_BASE = "/api/store"

export const DEFAULT_STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || "default"

const defaultVariants: StorefrontVariants = {
  banner: "none",
  header: "header-01",
  hero: "custom",
  categories: "list",
  productCards: "both",
  productDetails: "dialog",
  cart: "dialog",
  search: "panel",
  productPage: "editorial",
  cartStyle: "cart-02",
  footer: "footer-01",
}

const defaultNavigation: NavigationSection[] = [
  { title: "Home", href: "/" },
  { title: "Shop", href: "#collection" },
  { title: "Cart", href: "/cart" },
]

function normalizeStoreNavigation(raw: StoreResponse["navigation"]): NavigationSection[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return defaultNavigation
  }

  const items = raw
    .map((entry) => {
      const title = entry.title?.trim() || entry.label?.trim() || ""
      const href = entry.href?.trim() || ""
      if (!title || !href) return null
      return { title, href }
    })
    .filter((item): item is NavigationSection => item !== null)

  return items.length > 0 ? items : defaultNavigation
}

class StoreApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "StoreApiError"
  }
}

export { StoreApiError }

async function request<T>(
  path: string,
  options: RequestInit & { origin?: string } = {},
): Promise<T> {
  const base = options.origin ? `${options.origin}${API_BASE}` : API_BASE
  const url = `${base}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  const json = await res.json()

  if (!json.success) {
    throw new StoreApiError(
      json.message || "Unknown API error",
      res.status,
    )
  }

  return json.data as T
}

export type StoreResponse = {
  id: string
  slug: string
  name: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  logoUrl: string | null
  primaryColor: string | null
  accentColor: string | null
  navigation?: Array<{ title?: string; label?: string; href: string }> | null
  brandId: string | null
  createdAt: string
  updatedAt: string
}

export type CartItemResponse = {
  id: string
  productId: string
  variantId: string
  quantity: number
  unitPriceSnapshot: number
  product: { name: string; image: string }
  variant: { title: string; sku: string }
}

export type CartResponse = {
  cart: { id: string } | null
  items: CartItemResponse[]
  subtotal: number
}

export type OrderResponse = {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  total: number
  customerEmail: string
  items: Array<{
    productName: string
    variantTitle: string | null
    quantity: number
    price: number
  }>
}

export type CheckoutResponse = {
  order: {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    subtotal: number
    total: number
    customerEmail: string
  }
  paymentUrl: string
}

export async function getStore(storeId: string, opts?: { origin?: string }): Promise<StoreResponse> {
  return request<StoreResponse>(`/${storeId}`, opts || {})
}

export async function getStoreCategories(storeId: string, opts?: { origin?: string }) {
  return request<Array<{
    id: string
    storeId: string
    title: string
    count: string
    image: string
    createdAt: string
  }>>(`/${storeId}/categories`, opts || {})
}

export async function getStoreProducts(
  storeId: string,
  page = 1,
  limit = 20,
  category?: string,
  opts?: { origin?: string },
) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (category) params.set("category", category)
  return request<{
    products: Array<{
      id: string
      slug: string
      name: string
      price: number
      salePrice?: number
      image: string
      imgAlt?: string
      badges: string[]
      inventory?: number
      variants?: Array<{
        id: string
        title: string
        available: number
        inventory?: number
        reserved?: number
      }>
      category?: string
      description?: string
      images?: string[]
      sizes?: string[]
      currency?: string
      stockMessage?: string
      detail?: {
        category?: string
        description?: string
        images?: string[]
        sizes?: string[]
        currency?: string
        stockMessage?: string
      }
    }>
    pagination: { page: number; limit: number; total: number; totalPages: number }
  }>(`/${storeId}/products?${params}`, opts || {})
}

export async function addToCart(
  storeId: string,
  body: {
    sessionToken: string
    productId: string
    variantId?: string
    quantity: number
  },
) {
  return request(`/${storeId}/cart`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function trackStorePageView(storeId: string, productId?: string) {
  const { getStoreSessionId } = await import("@/lib/analytics/session")
  const sessionId = getStoreSessionId()
  if (!sessionId) return

  await fetch(`${API_BASE}/${storeId}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "page_view",
      sessionId,
      productId,
    }),
  }).catch(() => undefined)
}

export async function getCart(
  storeId: string,
  sessionToken: string,
) {
  const data = await request<CartResponse>(`/${storeId}/cart/${sessionToken}`)
  return {
    ...data,
    items: data.items.map((item) => ({
      id: item.productId,
      cartItemId: item.id,
      productId: item.productId,
      name: item.product.name,
      category: item.variant?.title ?? "",
      image: item.product.image,
      price: item.unitPriceSnapshot,
      quantity: item.quantity,
      variantId: item.variantId,
      sku: item.variant?.sku,
      variantTitle: item.variant?.title,
    })),
  }
}

export async function updateCartItem(
  storeId: string,
  sessionToken: string,
  itemId: string,
  quantity: number,
) {
  return request(`/${storeId}/cart/${sessionToken}/item/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  })
}

export async function deleteCartItem(
  storeId: string,
  sessionToken: string,
  itemId: string,
) {
  return request(`/${storeId}/cart/${sessionToken}/item/${itemId}`, {
    method: "DELETE",
  })
}

export async function checkout(
  storeId: string,
  body: {
    sessionToken: string
    customerEmail: string
    shippingAddress?: string
    idempotencyKey?: string
  },
): Promise<CheckoutResponse> {
  return request<CheckoutResponse>(`/${storeId}/checkout`, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

export async function getOrderConfirmation(
  storeId: string,
  orderId: string,
  sessionToken: string,
  opts?: { origin?: string },
): Promise<OrderResponse> {
  const params = new URLSearchParams({ sessionToken })
  return request<OrderResponse>(`/${storeId}/orders/${orderId}/confirmation?${params}`, opts || {})
}

export async function getOrder(
  storeId: string,
  orderId: string,
  opts?: { origin?: string },
): Promise<OrderResponse> {
  return request<OrderResponse>(`/${storeId}/orders/${orderId}`, opts || {})
}

// --- High-level helpers for assembling StorefrontConfig ---

export async function getStorefrontConfig(
  storeId: string,
  options?: { navigation?: NavigationSection[]; origin?: string },
): Promise<StorefrontConfig | null> {
  try {
    const reqOpts = options?.origin ? { origin: options.origin } : {}
    const [store, categories, products] = await Promise.all([
      getStore(storeId, reqOpts),
      getStoreCategories(storeId, reqOpts).catch(() => [] as never),
      getStoreProducts(storeId, 1, 100, undefined, reqOpts).catch(() => null),
    ])

    return {
      id: store.slug,
      name: store.name,
      heroBadge: store.heroBadge,
      heroTitle: store.heroTitle,
      heroDescription: store.heroDescription,
      heroImage: store.heroImage,
      navigation: options?.navigation ?? normalizeStoreNavigation(store.navigation),
      categories: categories.map((c) => ({
        id: c.id,
        title: c.title,
        count: c.count,
        image: c.image,
      })),
      products: (() => {
        try {
          return ((products?.products ?? []) || []).map((p) => ({
            id: p?.id ?? p?.slug ?? "",
            slug: p?.slug ?? "",
            name: p?.name ?? "",
            price: p?.price ?? 0,
            salePrice: p?.salePrice ?? undefined,
            image: p?.image ?? "",
            imgAlt: p?.imgAlt ?? p?.name ?? "",
            badges: Array.isArray(p?.badges) ? p.badges : [],
            inventory: p?.inventory ?? 0,
            variants: Array.isArray(p?.variants)
              ? p.variants.map((variant) => ({
                  id: variant.id,
                  title: variant.title,
                  available: variant.available ?? 0,
                  inventory: variant.inventory,
                  reserved: variant.reserved,
                }))
              : [],
            detail: p?.detail ?? (p?.category || p?.description ? {
              category: p?.category,
              description: p?.description,
              images: p?.images,
              sizes: p?.sizes,
              currency: p?.currency,
              stockMessage: p?.stockMessage,
            } : undefined),
          }))
        } catch {
          return [] as StoreProduct[]
        }
      })(),
      variants: defaultVariants,
      theme: {
        logoUrl: store.logoUrl ?? undefined,
        primaryColor: store.primaryColor ?? undefined,
        accentColor: store.accentColor ?? undefined,
      },
    }
  } catch {
    return null
  }
}

export async function getDefaultStorefrontConfig(
  options?: { navigation?: NavigationSection[]; origin?: string },
): Promise<StorefrontConfig | null> {
  try {
    const reqOpts = options?.origin ? { origin: options.origin } : {}
    const store = await getStore(DEFAULT_STORE_ID, reqOpts)
    return getStorefrontConfig(store.slug, options)
  } catch {
    return null
  }
}
