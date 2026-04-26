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
  sections?: StorefrontSection[]
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
    header: "header-01",
    hero: "hero-section-41",
    categories: "cards",
    productCards: "product-card-01",
    productDetails: "dialog",
    cart: "route",
    search: "panel",
    productPage: "editorial",
    cartStyle: "standard",
    footer: "footer-02",
  },
  sections: [
    { type: "categories", title: "Shop by category", description: "Explore curated collections before browsing the full catalog." },
    { type: "featured-products", title: "Featured products", description: "Spotlight items picked for high-intent shopping moments.", limit: 3 },
    { type: "merchandising", title: "Collection highlights", description: "Switch between merchandising views to spotlight different buying intents." },
    { type: "collection-grid", title: "Wearables built for every day", badge: "Galaxy Watch Store", perPage: 6 },
  ],
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

const performanceApparelProducts: StoreProduct[] = [
  {
    slug: "form-tee-black",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Form tee in black",
    name: "Form Tee",
    price: 58,
    inventory: 12,
    badges: ["New", "Tops"],
    detail: {
      category: "Training · Tee",
      description: "Soft-weight performance tee with a close but non-restrictive fit built for daily training.",
      sizes: ["XS", "S", "M", "L", "XL"],
    },
  },
  {
    slug: "foundry-oversized-hoodie",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Oversized hoodie",
    name: "Foundry Oversized Hoodie",
    price: 96,
    salePrice: 82,
    inventory: 6,
    badges: ["Layering", "Hoodies"],
    detail: {
      category: "Recovery · Hoodie",
      description: "Heavyweight brushed hoodie with a relaxed silhouette and low-visibility branding.",
      sizes: ["S", "M", "L", "XL"],
    },
  },
  {
    slug: "phase-7-inch-short",
    image: "https://images.unsplash.com/photo-1506629905607-d405b7a1b382?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Training shorts",
    name: "Phase 7\" Short",
    price: 64,
    inventory: 9,
    badges: ["Shorts", "Training"],
    detail: {
      category: "Training · Shorts",
      description: "Technical 7-inch short designed for lifting, conditioning, and repeat daily use.",
      sizes: ["S", "M", "L", "XL"],
    },
  },
  {
    slug: "base-seamless-long-sleeve",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Long sleeve performance top",
    name: "Base Seamless Long Sleeve",
    price: 72,
    inventory: 4,
    badges: ["Tops", "Seamless"],
    detail: {
      category: "Performance · Long Sleeve",
      description: "Streamlined seamless layer with body-mapped ventilation and clean visual texture.",
      sizes: ["S", "M", "L", "XL"],
    },
  },
  {
    slug: "district-tapered-jogger",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Tapered jogger",
    name: "District Tapered Jogger",
    price: 88,
    inventory: 7,
    badges: ["Bottoms", "Joggers"],
    detail: {
      category: "Lifestyle · Jogger",
      description: "Structured tapered jogger built for warm-up, travel, and everyday wear.",
      sizes: ["S", "M", "L", "XL"],
    },
  },
  {
    slug: "canvas-tank-stone",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    imgAlt: "Training tank",
    name: "Canvas Tank",
    price: 42,
    inventory: 11,
    badges: ["Tops", "Essentials"],
    detail: {
      category: "Training · Tank",
      description: "Essential training tank with a clean arm opening and minimal chest branding.",
      sizes: ["S", "M", "L", "XL"],
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
    header: "header-01",
    hero: "hero-editorial",
    categories: "split",
    productCards: "product-card-04",
    productDetails: "route",
    cart: "route",
    search: "minimal",
    productPage: "split",
    cartStyle: "minimal",
    footer: "footer-03",
  },
  sections: [
    { type: "categories", title: "Curated edits", description: "A featured-first layout for a more editorial storefront." },
    { type: "collection-grid", title: "Performance wearables and essentials", badge: "Fitness Wear Store", perPage: 8 },
    { type: "featured-products", title: "Featured essentials", description: "Hero products worth pinning to the top of the catalog.", limit: 4 },
    { type: "merchandising", title: "Merchandising view", description: "Rotate between new, best-selling, and sale-ready products." },
  ],
}

export const apexAthleticsStore: StorefrontConfig = {
  id: "apex-athletics",
  name: "Apex Athletics",
  heroBadge: "Spring training 26",
  heroTitle: "Performance apparel with a quieter edge.",
  heroDescription: "Minimal training essentials, stripped-back branding, and a registry-driven storefront built for a modern performance label.",
  heroImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1400&auto=format&fit=crop",
  navigation: [
    { title: "Home", href: "/" },
    { title: "New In", href: "#collection" },
    { title: "Tops", href: "#categories" },
    { title: "Bottoms", href: "#categories" },
    { title: "Accessories", href: "#categories" },
    { title: "Cart", href: "/cart" },
  ],
  categories: [
    { id: "new-in", title: "New In", count: "Fresh performance layers", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop" },
    { id: "tops", title: "Tops", count: "Tees, tanks, and long sleeves", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900&auto=format&fit=crop" },
    { id: "bottoms", title: "Bottoms", count: "Joggers and shorts", image: "https://images.unsplash.com/photo-1506629905607-d405b7a1b382?q=80&w=900&auto=format&fit=crop" },
    { id: "outerwear", title: "Outerwear", count: "Hoodies and recovery layers", image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=900&auto=format&fit=crop" },
    { id: "seamless", title: "Seamless", count: "Body-mapped performance pieces", image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=900&auto=format&fit=crop" },
  ],
  products: performanceApparelProducts,
  variants: {
    banner: "none",
    header: "header-03",
    hero: "hero-editorial",
    categories: "split",
    productCards: "product-card-04",
    productDetails: "route",
    cart: "route",
    search: "minimal",
    productPage: "editorial",
    cartStyle: "minimal",
    footer: "footer-03",
  },
  sections: [
    { type: "featured-products", title: "New arrivals", description: "Clean, functional silhouettes built for repeat wear.", limit: 3 },
    { type: "categories", title: "Shop by category", description: "Move between tops, bottoms, and layers with a more editorial split layout." },
    { type: "collection-grid", title: "Performance apparel with a quieter edge.", badge: "Apex Athletics", perPage: 6, variant: "grid-02" },
    { type: "merchandising", title: "Shop the edit", description: "Rotate between new arrivals, best performers, and markdown-ready styles." },
  ],
}

export const storefronts: StorefrontConfig[] = [galaxyWatchStore, fitnessWearStore, apexAthleticsStore]

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

export function toCartLine(product: StoreProduct, quantity: number): ShoppingCartLine {
  return {
    id: product.slug,
    name: product.name,
    category: product.badges[0] ?? "Wearable",
    image: product.image,
    price: product.salePrice ?? product.price,
    quantity,
    currency: product.detail?.currency ?? "$",
  }
}
