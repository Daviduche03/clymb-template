import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import type { ProductItem } from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"

export type ShoppingCartLine = {
  id: string
  name: string
  category: string
  image: string
  price: number
  quantity: number
  productId?: string
  variantId?: string
  variantTitle?: string
  cartItemId?: string
  sku?: string
  currency?: string
}

export type ShoppingCartLineProps = {
  line?: ShoppingCartLine
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
  className?: string
}

export type ProductDetailModel = {
  name: string
  description: string
  category: string
  images: string[]
  sizes: string[]
  currency: string
  /** Price shown as the main (sale) price */
  currentPrice: number
  /** Optional list / MSRP price */
  compareAtPrice?: number
  stockMessage?: string
  sizeAvailability?: Record<string, number>
}

export type StoreProduct = ProductItem & {
  id?: string
  slug: string
  detail?: Partial<ProductDetailModel>
  variants?: Array<{
    id: string
    title: string
    available: number
    inventory?: number
    reserved?: number
  }>
}

export type StoreCategory = {
  id: string | number
  title: string
  count?: string
  image?: string
}

export type StorefrontVariants = {
  banner: "none" | "promo-01" | "promo-03"
  header: "header-01" | "header-02" | "header-03" | "header-04"
  hero: "custom" | "hero-section-01" | "hero-section-41" | "hero-editorial" | "hero-lookbook" | "hero-full-bleed"
  categories: "cards" | "list" | "circle" | "split"
  productDetails: "dialog" | "route" | "both"
  cart: "route" | "route-2" | "both"
  search: "panel" | "minimal"
  productPage: "editorial" | "split" | "gallery-sticky-left" | "gallery-sticky-right"
  cartStyle: "cart-01" | "cart-02" | "cart-03"
  footer: "footer-01" | "footer-02" | "footer-03"
}

export type StorefrontSection =
  | { type: "categories"; title?: string; description?: string }
  | { type: "featured-products"; title?: string; description?: string; limit?: number }
  | { type: "merchandising"; title?: string; description?: string }
  | { type: "collection-grid"; title?: string; badge?: string; perPage?: number; variant?: "grid-01" | "grid-02" }

export type StoreTheme = {
  logoUrl?: string
  primaryColor?: string
  accentColor?: string
}

export type StorefrontConfig = {
  id: string
  name: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  navigation: NavigationSection[]
  categories: StoreCategory[]
  products: StoreProduct[]
  variants: StorefrontVariants
  sections?: StorefrontSection[]
  theme?: StoreTheme
}

export function getDefaultStorefrontSections(config: StorefrontConfig): StorefrontSection[] {
  return config.sections ?? [
    { type: "categories" },
    { type: "featured-products", limit: 3 },
    { type: "merchandising" },
    { type: "collection-grid", title: config.heroTitle, badge: config.name, perPage: 6 },
  ]
}

export function mapNavigationForStore(nav: NavigationSection[]): NavigationSection[] {
  return nav
}

export function productToDetailModel(product: StoreProduct): ProductDetailModel {
  const unit = product.salePrice ?? product.price
  const sizeAvailability =
    product.variants && product.variants.length > 0
      ? Object.fromEntries(product.variants.map((variant) => [variant.title, variant.available]))
      : undefined
  const totalAvailable =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((sum, variant) => sum + variant.available, 0)
      : (product.inventory ?? 0)

  return {
    name: product.name,
    category: product.detail?.category ?? (product.badges.join(" · ") || "Wearables"),
    description:
      product.detail?.description ??
      `Includes ${product.badges.join(" · ")}. Built for all-day comfort, fitness tracking, and seamless notifications.`,
    images: product.detail?.images ?? [product.image, product.image, product.image, product.image],
    sizes: product.detail?.sizes ?? product.variants?.map((variant) => variant.title) ?? ["40mm", "44mm", "Ultra"],
    currency: product.detail?.currency ?? "$",
    currentPrice: product.detail?.currentPrice ?? unit,
    compareAtPrice:
      product.detail?.compareAtPrice ?? (product.salePrice != null ? product.price : undefined),
    stockMessage:
      totalAvailable <= 0
        ? "Out of stock"
        : totalAvailable <= 3
          ? `Only ${totalAvailable} left`
          : (product.detail?.stockMessage ?? "Free returns within 30 days."),
    sizeAvailability,
  }
}

export function toCartLine(product: StoreProduct, quantity: number, variantTitle?: string): ShoppingCartLine {
  const defaultVariant = (product.detail?.sizes ?? [])[0] ?? "default"
  return {
    id: product.slug,
    productId: product.id,
    name: product.name,
    category: variantTitle
      ? `${product.badges[0] ?? "Wearable"} · ${variantTitle}`
      : (product.badges[0] ?? "Wearable"),
    image: product.image,
    price: product.salePrice ?? product.price,
    quantity,
    variantId: variantTitle || defaultVariant,
    variantTitle,
    currency: product.detail?.currency ?? "$",
  }
}

export type { NavigationSection }
