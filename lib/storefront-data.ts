import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import type { ProductItem } from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import type { ShoppingCartLine } from "@/components/commercn/carts/cart-01"
import type { ProductDetailModel } from "@/components/commercn/product-details/product-detail-01"

export type StoreProduct = ProductItem & {
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
  hero: "custom" | "hero-section-01" | "hero-section-41"
  categories: "cards" | "list" | "circle"
  productCards: "none" | "product-card-01" | "product-card-02" | "product-card-03" | "both"
  productDetails: "dialog" | "route" | "both"
  cart: "dialog" | "route" | "both"
  footer: "footer-01" | "footer-02"
}

export type StoreTheme = {
  logoUrl?: string
  primaryColor?: string   // oklch value, e.g. "0.488 0.243 264.376"
  accentColor?: string    // oklch value
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
  theme?: StoreTheme
}

export const CART_STORAGE_KEY = "storefront_cart_v1"

const sharedProducts: StoreProduct[] = [
  {
    slug: "galaxy-watch-6-classic",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png",
    imgAlt: "Samsung Galaxy Watch 6",
    name: "Samsung Galaxy Watch 6 Classic",
    price: 129,
    inventory: 8,
    badges: ["Watch", "Samsung"],
    detail: {
      category: "Watch · Samsung",
      description: "Premium stainless-steel smartwatch with advanced health tracking and classic rotating bezel.",
    },
  },
  {
    slug: "galaxy-watch-7",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png",
    imgAlt: "Samsung Galaxy Watch 7",
    name: "Samsung Galaxy Watch 7",
    price: 229,
    salePrice: 139,
    inventory: 2,
    badges: ["Watch", "Samsung"],
  },
  {
    slug: "galaxy-watch-ultra",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
    imgAlt: "Samsung Galaxy Watch Ultra",
    name: "Samsung Galaxy Watch Ultra",
    price: 119,
    inventory: 0,
    badges: ["Watch", "Samsung"],
  },
  {
    slug: "galaxy-watch-7-lte",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-3.png",
    imgAlt: "Samsung Galaxy Watch 7 LTE",
    name: "Samsung Galaxy Watch 7 LTE",
    price: 129,
    inventory: 4,
    badges: ["Watch", "Samsung"],
  },
  {
    slug: "spigen-rugged-armor-pro",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png",
    imgAlt: "Spigen Rugged Armor Pro",
    name: "Spigen Rugged Armor Pro",
    price: 239,
    inventory: 3,
    badges: ["Case", "Spigen"],
  },
  {
    slug: "mosmoc-rugged-no-gap",
    image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-1.png",
    imgAlt: "Mosmoc Rugged No Gap",
    name: "Mosmoc Rugged No Gap",
    price: 149,
    inventory: 10,
    badges: ["Case", "Samsung"],
  },
]

export const galaxyWatchStore: StorefrontConfig = {
  id: "galaxy-watch",
  name: "Galaxy Watch Store",
  heroBadge: "Samsung Galaxy Watch",
  heroTitle: "Wearables built for every day",
  heroDescription:
    "Browse categories, open product pages or quick dialogs, and add to cart in one reusable storefront shell.",
  heroImage: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png",
  navigation: [
    { title: "Home", href: "/" },
    { title: "Shop", href: "#collection" },
    { title: "Categories", href: "#categories" },
    { title: "Cart", href: "/cart" },
  ],
  categories: [
    { id: 1, title: "Galaxy Watch", count: "Classic, Pro & Ultra", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-6.png" },
    { id: 2, title: "Latest models", count: "Watch 7 & LTE", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-5.png" },
    { id: 3, title: "Rugged & sport", count: "Ultra & outdoor", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-4.png" },
    { id: 4, title: "Bands & straps", count: "Silicone, leather, metal", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Cases & protection", count: "Spigen, Mosmoc & more", image: "https://cdn.shadcnstudio.com/ss-assets/blocks/ecommerce/product-list/image-2.png" },
    { id: 6, title: "Accessories", count: "Chargers & screen care", image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=800&auto=format&fit=crop" },
  ],
  products: sharedProducts,
  variants: {
    banner: "promo-03",
    hero: "hero-section-41",
    categories: "cards",
    productCards: "product-card-01",
    productDetails: "dialog",
    cart: "route",
    footer: "footer-02",
  },
}

const fitnessProducts: StoreProduct[] = [
  {
    slug: "clymb-tracker-pro",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Clymb Tracker Pro",
    name: "Clymb Tracker Pro",
    price: 199,
    salePrice: 159,
    inventory: 5,
    badges: ["Performance", "New"],
    detail: {
      category: "Performance · Tracker",
      description: "Advanced biometric tracking with 14-day battery life and precision GPS.",
    },
  },
  {
    slug: "smart-ring-01",
    image: "https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Smart Ring",
    name: "Clymb Recovery Ring",
    price: 299,
    inventory: 1,
    badges: ["Recovery", "Wellness"],
    detail: {
      category: "Wellness · Ring",
      description: "Discreet titanium ring that tracks sleep, readiness, and recovery metrics.",
    },
  },
  {
    slug: "compression-sleeve",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Compression Sleeve",
    name: "Pro Compression Sleeve",
    price: 45,
    inventory: 0,
    badges: ["Gear", "Training"],
    detail: {
      category: "Gear · Training",
      description: "Medical-grade compression to improve blood flow and reduce muscle fatigue.",
    },
  },
  {
    slug: "compression-sleeve4",
    image: "https://images.unsplash.com/photo-1603984362497-0a878f60a022?q=80&w=800&auto=format&fit=crop",
    imgAlt: "Compression Sleeve",
    name: "Pro Compression Sleeve 4",
    price: 45,
    inventory: 9,
    badges: ["Gear", "Training"],
    detail: {
      category: "Gear · Training",
      description: "Compression to improve blood flow and reduce muscle fatigue.",
    },
  },
]

export const fitnessWearStore: StorefrontConfig = {
  ...galaxyWatchStore,
  id: "fitness-wear",
  name: "Fitness Wear Store",
  heroBadge: "Fitness Collection",
  heroTitle: "Performance wearables and essentials",
  heroDescription: "Same component system, alternate storefront variant with list categories and route-first product flow.",
  categories: [
    {
      id: "new-fitness",
      title: "New Arrivals",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "activewear",
      title: "Activewear",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "footwear",
      title: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "equipment",
      title: "Equipment",
      image: "https://images.unsplash.com/photo-1517438984742-1262db08379e?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "supplements",
      title: "Supplements",
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?q=80&w=400&auto=format&fit=crop",
    },
  ],
  products: fitnessProducts,
  variants: {
    banner: "promo-01",
    hero: "hero-section-01",
    categories: "circle",
    productCards: "product-card-02",
    productDetails: "route",
    cart: "route",
    footer: "footer-02",
  },
}

export const storefronts: StorefrontConfig[] = [galaxyWatchStore, fitnessWearStore]

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
    highlights: [
      "Minimal exterior branding with a premium finish.",
      "Built for daily wear, commute, and low-key training sessions.",
      "Comfort-first construction with a clean, elevated silhouette.",
    ],
    details: [
      { label: "Category", value: product.detail?.category ?? (product.badges[0] ?? "Wearable") },
      { label: "Sizing", value: (product.detail?.sizes ?? ["S", "M", "L"]).join(" / ") },
      { label: "Finish", value: "Premium everyday performance" },
    ],
    shippingNote: "Free delivery on qualifying orders. Simple 30-day returns.",
  }
}

export function toCartLine(product: StoreProduct, quantity: number): ShoppingCartLine {
  return {
    id: product.slug,
    name: product.name,
    category: product.badges[0] ?? "Wearable",
    image: product.image,
    price: product.salePrice ?? product.price,
    quantity,
  }
}
