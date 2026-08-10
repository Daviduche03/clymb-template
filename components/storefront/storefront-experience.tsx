"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import { CategoryCard } from "@/components/storefront/category-card"
import { CategoryCircle } from "@/components/storefront/category-circle"
import { ProductCardBold } from "@/components/storefront/product-card-bold"
import { ProductCardWide } from "@/components/storefront/product-card-wide"
import { ProductDetailOne } from "@/components/storefront/product-detail-one"
import { ProductDetailTwo } from "@/components/storefront/product-detail-two"
import { ProductDetailThree } from "@/components/storefront/product-detail-three"
import { CategoryListEditorial } from "@/components/storefront/category-list-editorial"
import { CategorySectionSplit } from "@/components/storefront/category-section-split"
import { SearchCommandPalette } from "@/components/storefront/search-command-palette"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Pagination } from "@/components/ui/pagination"
import {
  getDefaultStorefrontSections,
  productToDetailModel,
  toCartLine,
  type StoreCategory,
  type StorefrontConfig,
  type StorefrontSection,
  type StoreProduct,
} from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

type MerchTab = "new" | "best" | "sale"
type SortOrder = "featured" | "price-asc" | "price-desc" | "name"

export function StorefrontExperience({
  config,
  searchOpen = false,
  onSearchOpenChange,
}: {
  config: StorefrontConfig
  searchOpen?: boolean
  onSearchOpenChange?: (open: boolean) => void
}) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<StoreProduct | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [merchTab, setMerchTab] = useState<MerchTab>("new")
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured")
  const [currentPage, setCurrentPage] = useState(1)

  const { lines, addToCart: addToCartBase, setLineQty, removeLine, cartError, clearCartError } = useCart(config.id)
  const { isWishlisted: isSlugWishlisted, toggleWishlist: toggleSlugWishlist } = useWishlist(config.id)

  const sections = useMemo(() => getDefaultStorefrontSections(config), [config])
  const detailModel = useMemo(() => (selected ? productToDetailModel(selected) : null), [selected])

  const allowDetailDialog = config.variants.productDetails === "dialog" || config.variants.productDetails === "both"
  const allowDetailRoute = config.variants.productDetails === "route" || config.variants.productDetails === "both"
  const allowCartRoute = config.variants.cart === "route" || config.variants.cart === "route-2" || config.variants.cart === "both"

  const productHref = useCallback((slug: string) => `/products/${slug}`, [])
  const cartHref = "/cart"

  const getInventory = useCallback((product: StoreProduct, variantTitle?: string) => {
    if (product.variants && product.variants.length > 0) {
      if (variantTitle) {
        return product.variants.find((variant) => variant.title === variantTitle)?.available ?? 0
      }
      return product.variants.reduce((sum, variant) => sum + variant.available, 0)
    }
    return product.inventory ?? 0
  }, [])
  const isOutOfStock = useCallback(
    (product: StoreProduct, variantTitle?: string) => getInventory(product, variantTitle) <= 0,
    [getInventory],
  )
  const isLowStock = useCallback(
    (product: StoreProduct, variantTitle?: string) => {
      const available = getInventory(product, variantTitle)
      return available > 0 && available <= 3
    },
    [getInventory],
  )

  const addToCart = useCallback(
    (product: StoreProduct, quantity: number, variantTitle?: string) => {
      if (isOutOfStock(product, variantTitle)) return
      void addToCartBase(toCartLine(product, quantity, variantTitle)).catch(() => {})
      if (allowCartRoute) window.location.href = cartHref
    },
    [addToCartBase, allowCartRoute, isOutOfStock, cartHref],
  )

  const scrollToCollection = useCallback(() => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const categoryTags = useMemo(() => {
    const tags = new Set<string>()
    const products = config.products ?? []
    products.forEach((product) => product.badges.forEach((badge) => tags.add(badge)))
    return [...tags]
  }, [config.products])

  const categoryTagByTitle = useMemo(() => {
    return new Map(
      config.categories.map((category) => {
        const normalizedTitle = category.title.toLowerCase()
        const matchingTag = categoryTags.find((tag) => normalizedTitle.includes(tag.toLowerCase()))
        return [category.title, matchingTag ?? null] as const
      }),
    )
  }, [categoryTags, config.categories])

  const filteredProducts = useMemo(() => {
    let result = config.products
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.badges.some((badge) => badge.toLowerCase().includes(query)),
      )
    }
    if (activeCategory) {
      result = result.filter((product) => product.badges.includes(activeCategory))
    }
    if (sortOrder === "price-asc") {
      return [...result].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
    }
    if (sortOrder === "price-desc") {
      return [...result].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    }
    if (sortOrder === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [activeCategory, config.products, searchQuery, sortOrder])

  const merchProducts = useMemo(() => {
    const all = config.products
    if (merchTab === "sale") return all.filter((product) => product.salePrice != null)
    if (merchTab === "new") {
      const taggedNew = all.filter((product) => product.badges.some((badge) => badge.toLowerCase() === "new"))
      return taggedNew.length > 0 ? taggedNew : all.slice(0, 6)
    }
    return [...all].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)).slice(0, 6)
  }, [config.products, merchTab])

  const inStockCount = useMemo(() => config.products.filter((product) => !isOutOfStock(product)).length, [config.products, isOutOfStock])

  const isProductWishlisted = useCallback(
    (product: { name: string }) => {
      const match = config.products.find((entry) => entry.name === product.name)
      return match ? isSlugWishlisted(match.slug) : false
    },
    [config.products, isSlugWishlisted],
  )

  const toggleProductWishlist = useCallback(
    (product: { name: string }) => {
      const match = config.products.find((entry) => entry.name === product.name)
      if (match) toggleSlugWishlist(match.slug)
    },
    [config.products, toggleSlugWishlist],
  )

  const onProductClick = useCallback(
    (product: StoreProduct) => {
      if (allowDetailDialog) {
        setSelected(product)
        setDetailOpen(true)
      }
    },
    [allowDetailDialog],
  )

  const activateCategory = useCallback(
    (category: string | null) => {
      setActiveCategory(category)
      scrollToCollection()
    },
    [scrollToCollection],
  )

  const renderSearchControls = (perPage: number, gridVariant: "grid-01" | "grid-02" = "grid-01") => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage))
    const pageStart = (currentPage - 1) * perPage
    const paginatedProducts = filteredProducts.slice(pageStart, pageStart + perPage)

    return (
      <>
        <div className="mx-auto max-w-7xl space-y-4 px-4 pt-12 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Catalog size" value={config.products.length.toString()} description="Curated products ready for merchandising." />
            <MetricCard label="In stock" value={inStockCount.toString()} description="Items available for immediate checkout." />
            <MetricCard label="Active filter" value={activeCategory ?? "All products"} description="Use the header search to filter and sort the catalog." />
          </div>
        </div>

        {config.products.length === 0 ? (
          <EmptyCatalog />
        ) : filteredProducts.length === 0 ? (
          <NoResults
            searchQuery={searchQuery}
            onReset={() => {
              setSearchQuery("")
              setActiveCategory(null)
              setSortOrder("featured")
            }}
          />
        ) : (
          <>
            <ProductList
              products={paginatedProducts.map((product) => ({ ...product, href: productHref(product.slug) }))}
              badge={config.name}
              title={config.heroTitle}
              variant={gridVariant}
              onProductClick={allowDetailDialog ? (product) => onProductClick(product as StoreProduct) : undefined}
              onAddToCart={(product) => addToCart(product as StoreProduct, 1)}
              isWishlisted={isProductWishlisted}
              onToggleWishlist={toggleProductWishlist}
              isInCart={(product) => !!lines[product.slug]}
              isOutOfStock={(product) => isOutOfStock(product as StoreProduct)}
              isLowStock={(product) => isLowStock(product as StoreProduct)}
            />
            {totalPages > 1 ? (
              <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            ) : null}
          </>
        )}
      </>
    )
  }

  const renderSection = (section: StorefrontSection) => {
    const storefrontSectionRegistry: {
      [K in StorefrontSection["type"]]: (section: Extract<StorefrontSection, { type: K }>) => ReactNode
    } = {
      categories: (section) => (
        <CategoriesSection
          key="categories"
          config={config}
          title={section.title ?? "Shop by category"}
          description={section.description ?? "Explore curated collections before browsing the full catalog."}
          categoryTagByTitle={categoryTagByTitle}
          onSelectCategory={activateCategory}
          scrollToCollection={scrollToCollection}
        />
      ),
      "featured-products": (section) => (
        <FeaturedProductsSection
          key="featured-products"
          title={section.title ?? "Featured products"}
          description={section.description ?? "Spotlight items picked for high-intent shopping moments."}
          products={config.products.slice(0, section.limit ?? 3)}
          productHref={productHref}
          allowDetailDialog={allowDetailDialog}
          onProductClick={onProductClick}
          addToCart={addToCart}
          isProductWishlisted={isProductWishlisted}
          toggleProductWishlist={toggleProductWishlist}
          lines={lines}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />
      ),
      merchandising: (section) => (
        <MerchandisingSection
          key="merchandising"
          title={section.title ?? "Collection highlights"}
          description={section.description ?? "Switch between merchandising views to spotlight different buying intents."}
          merchTab={merchTab}
          onTabChange={setMerchTab}
          products={merchProducts}
          productHref={productHref}
          allowDetailDialog={allowDetailDialog}
          onProductClick={onProductClick}
          addToCart={addToCart}
          isProductWishlisted={isProductWishlisted}
          toggleProductWishlist={toggleProductWishlist}
          lines={lines}
          isOutOfStock={isOutOfStock}
          isLowStock={isLowStock}
        />
      ),
      "collection-grid": (section) => (
        <div key="collection-grid" id="collection" className="bg-white">
          {renderSearchControls(section.perPage ?? 6, section.variant ?? "grid-01")}
        </div>
      ),
    }

    return storefrontSectionRegistry[section.type](section as never)
  }

  return (
    <>
      {cartError ? (
        <div className="fixed top-4 right-4 z-50 max-w-sm border border-red-200 bg-white px-4 py-3 text-sm text-red-700">
          <div className="flex items-start justify-between gap-3">
            <p>{cartError}</p>
            <button type="button" className="text-red-500" onClick={clearCartError}>
              ×
            </button>
          </div>
        </div>
      ) : null}

      {sections.map((section, index) => (
        <div key={`${section.type}-${index}`}>{renderSection(section)}</div>
      ))}

      <SearchCommandPalette
        open={searchOpen}
        onOpenChange={(open) => onSearchOpenChange?.(open)}
        products={config.products}
        productHref={productHref}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        categoryTags={categoryTags}
        sortOrder={sortOrder}
        onSearchChange={setSearchQuery}
        onCategoryChange={setActiveCategory}
        onSortChange={setSortOrder}
      />

      <Dialog
        open={detailOpen}
        onOpenChange={(open) => {
          setDetailOpen(open)
          if (!open) setSelected(null)
        }}
      >
        <DialogContent className="max-h-[92vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-4xl" showCloseButton>
          {detailModel ? (
            <>
              {allowDetailRoute ? (
                <div className="flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={productHref(selected?.slug ?? "")}>Open full page</Link>
                  </Button>
                </div>
              ) : null}
              {config.variants.productPage === "gallery-sticky-left" ? (
                <ProductDetailTwo
                  product={detailModel}
                  className="mx-auto max-w-none p-0 sm:p-0"
                  onAddToCart={(quantity, size) => {
                    if (selected) addToCart(selected, quantity, size)
                    setDetailOpen(false)
                  }}
                />
              ) : config.variants.productPage === "gallery-sticky-right" ? (
                <ProductDetailThree
                  product={detailModel}
                  className="mx-auto max-w-none p-0 sm:p-0"
                  onAddToCart={(quantity, size) => {
                    if (selected) addToCart(selected, quantity, size)
                    setDetailOpen(false)
                  }}
                />
              ) : (
                <ProductDetailOne
                  product={detailModel}
                  variant={config.variants.productPage}
                  className="mx-auto max-w-none p-0 sm:p-0"
                  onAddToCart={(quantity, size) => {
                    if (selected) addToCart(selected, quantity, size)
                    setDetailOpen(false)
                  }}
                />
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

function MetricCard({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <div className="border border-zinc-200 bg-white p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
    </div>
  )
}

function CategoriesSection({
  config,
  title,
  description,
  categoryTagByTitle,
  onSelectCategory,
  scrollToCollection,
}: {
  config: StorefrontConfig
  title: string
  description: string
  categoryTagByTitle: Map<string, string | null>
  onSelectCategory: (value: string | null) => void
  scrollToCollection: () => void
}) {
  const selectCategory = (category: StoreCategory) => onSelectCategory(categoryTagByTitle.get(category.title) ?? null)

  return (
    <section id="categories" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row lg:mb-10">
          <div className="flex flex-col gap-1">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Collections</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h2>
            <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
          </div>
          <Button className="group rounded-none px-0 text-xs uppercase tracking-[0.22em] text-zinc-950 hover:bg-transparent" variant="ghost" asChild>
            <a href="#collection" onClick={(event) => { event.preventDefault(); scrollToCollection() }}>
              View all products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>

        {config.variants.categories === "cards" ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {config.categories.map((category) => (
              <CategoryCard key={category.id} title={category.title} count={category.count || ""} imageSrc={category.image || ""} onClick={() => selectCategory(category)} />
            ))}
          </div>
        ) : null}

        {config.variants.categories === "list" ? (
          <CategoryListEditorial
            categories={config.categories}
            onSelect={selectCategory}
          />
        ) : null}

        {config.variants.categories === "circle" ? (
          <CategoryCircle categories={config.categories.map((category) => ({ title: category.title, image: category.image, onClick: () => selectCategory(category) }))} />
        ) : null}

        {config.variants.categories === "split" ? (
          <CategorySectionSplit categories={config.categories} onSelect={(category) => selectCategory(category)} />
        ) : null}
      </div>
    </section>
  )
}

function FeaturedProductsSection({
  title,
  description,
  products,
  productHref,
  allowDetailDialog,
  onProductClick,
  addToCart,
  isProductWishlisted,
  toggleProductWishlist,
  lines,
  isOutOfStock,
  isLowStock,
}: {
  title: string
  description: string
  products: StoreProduct[]
  productHref: (slug: string) => string
  allowDetailDialog: boolean
  onProductClick: (product: StoreProduct) => void
  addToCart: (product: StoreProduct, quantity: number) => void
  isProductWishlisted: (product: { name: string }) => boolean
  toggleProductWishlist: (product: { name: string }) => void
  lines: Record<string, { quantity: number }>
  isOutOfStock: (product: StoreProduct) => boolean
  isLowStock: (product: StoreProduct) => boolean
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Featured edit</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h3>
        <p className="mb-8 mt-2 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) =>
            index % 2 === 0 ? (
              <ProductCardBold
                key={product.slug}
                product={{ ...product, href: productHref(product.slug) }}
                onProductClick={allowDetailDialog ? (p) => onProductClick(p as StoreProduct) : undefined}
                onAddToCart={(p) => addToCart(p as StoreProduct, 1)}
                isWishlisted={isProductWishlisted}
                onToggleWishlist={toggleProductWishlist}
                isInCart={(p) => !!lines[p.slug]}
                isOutOfStock={(p) => isOutOfStock(p as StoreProduct)}
                isLowStock={(p) => isLowStock(p as StoreProduct)}
              />
            ) : (
              <ProductCardWide
                key={product.slug}
                product={{ ...product, href: productHref(product.slug) }}
                onProductClick={allowDetailDialog ? (p) => onProductClick(p as StoreProduct) : undefined}
                onAddToCart={(p) => addToCart(p as StoreProduct, 1)}
                isWishlisted={isProductWishlisted}
                onToggleWishlist={toggleProductWishlist}
                isInCart={(p) => !!lines[p.slug]}
                isOutOfStock={(p) => isOutOfStock(p as StoreProduct)}
                isLowStock={(p) => isLowStock(p as StoreProduct)}
              />
            ),
          )}
        </div>
      </div>
    </section>
  )
}

function MerchandisingSection(props: {
  title: string
  description: string
  merchTab: MerchTab
  onTabChange: (tab: MerchTab) => void
  products: StoreProduct[]
  productHref: (slug: string) => string
  allowDetailDialog: boolean
  onProductClick: (product: StoreProduct) => void
  addToCart: (product: StoreProduct, quantity: number) => void
  isProductWishlisted: (product: { name: string }) => boolean
  toggleProductWishlist: (product: { name: string }) => void
  lines: Record<string, { quantity: number }>
  isOutOfStock: (product: StoreProduct) => boolean
  isLowStock: (product: StoreProduct) => boolean
}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Merchandising</p>
            <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{props.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{props.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["new", "best", "sale"] as MerchTab[]).map((tab) => (
              <Button key={tab} size="sm" variant={props.merchTab === tab ? "default" : "outline"} className="rounded-full" onClick={() => props.onTabChange(tab)}>
                {tab === "new" ? "New arrivals" : tab === "best" ? "Best sellers" : "On sale"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {props.products.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-base font-medium text-zinc-900">No products in this merchandising bucket yet.</p>
            <p className="mt-1 text-sm text-zinc-600">Try another tab or add products with sale/new metadata.</p>
          </div>
        </div>
      ) : (
        <ProductList
          products={props.products.map((product) => ({ ...product, href: props.productHref(product.slug) }))}
          hideHeader
          compact
          onProductClick={props.allowDetailDialog ? (product) => props.onProductClick(product as StoreProduct) : undefined}
          onAddToCart={(product) => props.addToCart(product as StoreProduct, 1)}
          isWishlisted={props.isProductWishlisted}
          onToggleWishlist={props.toggleProductWishlist}
          isInCart={(product) => !!props.lines[product.slug]}
          isOutOfStock={(product) => props.isOutOfStock(product as StoreProduct)}
          isLowStock={(product) => props.isLowStock(product as StoreProduct)}
        />
      )}
    </section>
  )
}

function EmptyCatalog() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-lg font-semibold text-zinc-900">No products yet</p>
      <p className="mt-1 text-sm text-zinc-600">This storefront has no catalog items yet.</p>
    </div>
  )
}

function NoResults({ searchQuery, onReset }: { searchQuery: string; onReset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <p className="text-lg font-semibold text-zinc-900">No matches found{searchQuery ? ` for "${searchQuery}"` : ""}.</p>
      <p className="mt-1 text-sm text-zinc-600">Try a different keyword, remove filters, or browse highlighted collections above.</p>
      <Button variant="outline" className="mt-4" onClick={onReset}>Clear filters</Button>
    </div>
  )
}

