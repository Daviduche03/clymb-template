import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { eq } from "drizzle-orm"
import {
  storefronts,
  type StoreCategory,
  type StoreProduct,
  type StorefrontConfig,
  type StorefrontVariants,
} from "@/lib/storefront-data"

type StoreSummary = Pick<StorefrontConfig, "id" | "name" | "heroBadge" | "theme">

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
  cartStyle: "standard",
  footer: "footer-01",
}

function cloneStorefront(store: StorefrontConfig): StorefrontConfig {
  return JSON.parse(JSON.stringify(store)) as StorefrontConfig
}

function fallbackStoreBySlug(slug: string): StorefrontConfig | null {
  const store = storefronts.find((candidate) => candidate.id === slug)
  return store ? cloneStorefront(store) : null
}

function fallbackStores(): StoreSummary[] {
  return storefronts.map(({ id, name, heroBadge, theme }) => ({ id, name, heroBadge, theme }))
}

async function getDbModules() {
  try {
    const [{ db }, schemaModule] = await Promise.all([import("@/db"), import("@/db/schema/stores")])
    return { db, schema: schemaModule }
  } catch {
    return null
  }
}

function mapCategories(
  categories: Array<{
    id: string
    title: string
    count: string | null
    image: string | null
  }>,
): StoreCategory[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    count: category.count ?? "",
    image: category.image ?? "",
  }))
}

function mapProducts(
  products: Array<{
    slug: string
    name: string
    price: number
    salePrice: number | null
    image: string | null
    imgAlt: string | null
    badges: unknown
    category: string | null
    description: string | null
    images: unknown
    sizes: unknown
    currency: string | null
    stockMessage: string | null
    inventory?: number | null
  }>,
): StoreProduct[] {
  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    price: product.price,
    salePrice: product.salePrice ?? undefined,
    image: product.image ?? "",
    imgAlt: product.imgAlt ?? product.name,
    badges: Array.isArray(product.badges) ? (product.badges as string[]) : [],
    inventory: product.inventory ?? undefined,
    detail: {
      category: product.category ?? undefined,
      description: product.description ?? undefined,
      images: Array.isArray(product.images) ? (product.images as string[]) : undefined,
      sizes: Array.isArray(product.sizes) ? (product.sizes as string[]) : undefined,
      currency: product.currency ?? "$",
      stockMessage: product.stockMessage ?? undefined,
    },
  }))
}

function mapStoreFromDb(
  store: {
    slug: string
    name: string
    heroBadge: string | null
    heroTitle: string | null
    heroDescription: string | null
    heroImage: string | null
    navigation: unknown
    variants: unknown
    logoUrl: string | null
    primaryColor: string | null
    accentColor: string | null
  },
  categories: StoreCategory[],
  products: StoreProduct[],
): StorefrontConfig {
  const fallbackStore = fallbackStoreBySlug(store.slug)

  return {
    id: store.slug,
    name: store.name,
    heroBadge: store.heroBadge ?? "",
    heroTitle: store.heroTitle ?? "",
    heroDescription: store.heroDescription ?? "",
    heroImage: store.heroImage ?? "",
    navigation: Array.isArray(store.navigation) ? (store.navigation as NavigationSection[]) : [],
    variants: typeof store.variants === "object" && store.variants
      ? ({ ...defaultVariants, ...(store.variants as Partial<StorefrontVariants>) })
      : defaultVariants,
    theme: {
      logoUrl: store.logoUrl ?? undefined,
      primaryColor: store.primaryColor ?? undefined,
      accentColor: store.accentColor ?? undefined,
    },
    sections: fallbackStore?.sections,
    categories,
    products,
  }
}

export async function listStores(): Promise<StoreSummary[]> {
  const dbModules = await getDbModules()

  if (!dbModules) return fallbackStores()

  const rows = await dbModules.db.query.stores.findMany({
    columns: {
      slug: true,
      name: true,
      heroBadge: true,
      logoUrl: true,
      primaryColor: true,
      accentColor: true,
    },
    orderBy: (stores, { asc }) => [asc(stores.createdAt)],
  })

  if (rows.length === 0) return fallbackStores()

  return rows.map((row) => ({
    id: row.slug,
    name: row.name,
    heroBadge: row.heroBadge ?? "",
    theme: {
      logoUrl: row.logoUrl ?? undefined,
      primaryColor: row.primaryColor ?? undefined,
      accentColor: row.accentColor ?? undefined,
    },
  }))
}

export async function getStoreBySlug(slug: string): Promise<StorefrontConfig | null> {
  const dbModules = await getDbModules()

  if (!dbModules) return fallbackStoreBySlug(slug)

  const store = await dbModules.db.query.stores.findFirst({
    where: eq(dbModules.schema.stores.slug, slug),
  })

  if (!store) return fallbackStoreBySlug(slug)

  const [dbCategories, dbProducts] = await Promise.all([
    dbModules.db.query.storeCategories.findMany({
      where: eq(dbModules.schema.storeCategories.storeId, store.id),
      orderBy: (categories, { asc }) => [asc(categories.createdAt)],
    }),
    dbModules.db.query.storeProducts.findMany({
      where: eq(dbModules.schema.storeProducts.storeId, store.id),
      orderBy: (products, { asc }) => [asc(products.createdAt)],
    }),
  ])

  return mapStoreFromDb(store, mapCategories(dbCategories), mapProducts(dbProducts))
}

export async function getDefaultStore(): Promise<StorefrontConfig | null> {
  const stores = await listStores()
  const preferredSlug = stores.find((store) => store.id === "galaxy-watch")?.id ?? stores[0]?.id

  if (!preferredSlug) return null

  return getStoreBySlug(preferredSlug)
}
