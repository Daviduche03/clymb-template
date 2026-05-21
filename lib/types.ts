import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import type { ProductItem } from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import type { ProductDetailModel } from "@/components/commercn/product-details/product-detail-01"

export type StoreProduct = ProductItem & {
  id?: string
  slug: string
  detail?: Partial<ProductDetailModel>
}

export type StoreCategory = {
  id: string | number
  title: string
  count?: string
  image?: string
}

export type StorefrontVariants = {
  banner: "none" | "promo-01" | "promo-03"
  header: "header-01" | "header-02" | "header-03"
  hero: "custom" | "hero-section-01" | "hero-section-41" | "hero-editorial"
  categories: "cards" | "list" | "circle" | "split"
  productCards: "none" | "product-card-01" | "product-card-02" | "product-card-03" | "product-card-04" | "both"
  productDetails: "dialog" | "route" | "both"
  cart: "dialog" | "route" | "both"
  search: "panel" | "minimal"
  productPage: "editorial" | "split"
  cartStyle: "standard" | "minimal"
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

export function mapNavigationForStore(basePath: string, nav: NavigationSection[]): NavigationSection[] {
  return nav.map((item) => {
    if (item.href === "/") return { ...item, href: basePath || "/" }
    if (item.href === "/cart") return { ...item, href: `${basePath}/cart` }
    return item
  })
}

export function productToDetailModel(product: StoreProduct): ProductDetailModel {
  const unit = product.salePrice ?? product.price
  return {
    name: product.name,
    category: product.detail?.category ?? (product.badges.join(" · ") || "Wearables"),
    description:
      product.detail?.description ??
      `Includes ${product.badges.join(" · ")}. Built for all-day comfort, fitness tracking, and seamless notifications.`,
    images: product.detail?.images ?? [product.image, product.image, product.image, product.image],
    sizes: product.detail?.sizes ?? ["40mm", "44mm", "Ultra"],
    currency: product.detail?.currency ?? "$",
    currentPrice: product.detail?.currentPrice ?? unit,
    compareAtPrice:
      product.detail?.compareAtPrice ?? (product.salePrice != null ? product.price : undefined),
    stockMessage: product.detail?.stockMessage ?? "Free returns within 30 days.",
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
