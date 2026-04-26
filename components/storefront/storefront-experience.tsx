"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useCallback, useMemo, useState } from "react"
import { ArrowRight, Search, ShoppingBag, X } from "lucide-react"
import { CategoryCard } from "@/components/commercn/categories/category-01"
import { CategoryListCard } from "@/components/commercn/categories/category-02"
import { CategoryFour } from "@/components/commercn/categories/category-04"
import { ProductCardOne } from "@/components/commercn/product-cards/product-card-01"
import { ProductCardTwo } from "@/components/commercn/product-cards/product-card-02"
import { ProductCardThree } from "@/components/commercn/product-cards/product-card-03"
import { ProductCardFour } from "@/components/commercn/product-cards/product-card-04"
import { ProductDetailOne } from "@/components/commercn/product-details/product-detail-01"
import { ShoppingCartOne } from "@/components/commercn/carts/cart-01"
import { CategorySectionSplit } from "@/components/storefront/category-section-split"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import {
  getDefaultStorefrontSections,
  productToDetailModel,
  toCartLine,
  type StoreCategory,
  type StorefrontConfig,
  type StorefrontSection,
  type StoreProduct,
} from "@/lib/storefront-data"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

type MerchTab = "new" | "best" | "sale"
type SortOrder = "featured" | "price-asc" | "price-desc" | "name"

export function StorefrontExperience({
  config,
  basePath = "",
}: {
  config: StorefrontConfig
  basePath?: string
}) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<StoreProduct | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [merchTab, setMerchTab] = useState<MerchTab>("new")
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured")
  const [currentPage, setCurrentPage] = useState(1)

  const { lines, cartCount, addToCart: addToCartBase, setLineQty, removeLine } = useCart(config.id)
  const { isWishlisted: isSlugWishlisted, toggleWishlist: toggleSlugWishlist } = useWishlist(config.id)

  const sections = useMemo(() => getDefaultStorefrontSections(config), [config])
  const detailModel = useMemo(() => (selected ? productToDetailModel(selected) : null), [selected])

  const allowDetailDialog = config.variants.productDetails === "dialog" || config.variants.productDetails === "both"
  const allowDetailRoute = config.variants.productDetails === "route" || config.variants.productDetails === "both"
  const allowCartDialog = config.variants.cart === "dialog" || config.variants.cart === "both"
  const allowCartRoute = config.variants.cart === "route" || config.variants.cart === "both"

  const productHref = useCallback((slug: string) => `${basePath}/products/${slug}`, [basePath])
  const cartHref = `${basePath}/cart`

  const getInventory = useCallback((product: StoreProduct) => product.inventory ?? 12, [])
  const isOutOfStock = useCallback((product: StoreProduct) => getInventory(product) <= 0, [getInventory])
  const isLowStock = useCallback((product: StoreProduct) => getInventory(product) > 0 && getInventory(product) <= 3, [getInventory])

  const addToCart = useCallback(
    (product: StoreProduct, quantity: number) => {
      if (isOutOfStock(product)) return
      addToCartBase(toCartLine(product, quantity))
      if (allowCartDialog) setCartOpen(true)
    },
    [addToCartBase, allowCartDialog, isOutOfStock],
  )

  const scrollToCollection = useCallback(() => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const categoryTags = useMemo(() => {
    const tags = new Set<string>()
    config.products.forEach((product) => product.badges.forEach((badge) => tags.add(badge)))
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

  const renderCard = useCallback(
    (product: StoreProduct) => {
      const detail = productToDetailModel(product)
      const cardProps = {
        id: product.slug,
        name: detail.name,
        category: detail.category,
        description: detail.description,
        price: detail.currentPrice,
        image: detail.images[0],
        isInCart: Boolean(lines[product.slug]),
        isOutOfStock: isOutOfStock(product),
        lowStockText: isLowStock(product) ? `Only ${getInventory(product)} left` : undefined,
        onClick: () => {
          if (allowDetailRoute) window.location.href = productHref(product.slug)
          else if (allowDetailDialog) onProductClick(product)
        },
        onAddToCart: () => addToCart(product, 1),
      }

      switch (config.variants.productCards) {
        case "product-card-01":
          return <ProductCardOne key={product.slug} {...cardProps} />
        case "product-card-03":
          return <ProductCardThree key={product.slug} {...cardProps} />
        case "product-card-04":
          return <ProductCardFour key={product.slug} {...cardProps} />
        default:
          return <ProductCardTwo key={product.slug} {...cardProps} />
      }
    },
    [addToCart, allowDetailDialog, allowDetailRoute, config.variants.productCards, getInventory, isLowStock, isOutOfStock, lines, onProductClick, productHref],
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
            <MetricCard label="Active filter" value={activeCategory ?? "All products"} description="Use filters to switch merchandising intent quickly." />
          </div>

          {config.variants.search === "minimal" ? (
            <MinimalSearchBar
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              categoryTags={categoryTags}
              filteredCount={filteredProducts.length}
              sortOrder={sortOrder}
              onSearchChange={setSearchQuery}
              onCategoryChange={setActiveCategory}
              onSortChange={setSortOrder}
            />
          ) : (
            <SearchPanel
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              categoryTags={categoryTags}
              filteredCount={filteredProducts.length}
              sortOrder={sortOrder}
              onSearchChange={setSearchQuery}
              onCategoryChange={setActiveCategory}
              onSortChange={setSortOrder}
            />
          )}
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
          renderCard={renderCard}
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
        <div key="collection-grid" id="collection" className="bg-white pb-16 sm:pb-20">
          {renderSearchControls(section.perPage ?? 6, section.variant ?? "grid-01")}
        </div>
      ),
    }

    return storefrontSectionRegistry[section.type](section as never)
  }

  return (
    <>
      {sections.map((section, index) => (
        <div key={`${section.type}-${index}`}>{renderSection(section)}</div>
      ))}

      <FloatingCart allowCartDialog={allowCartDialog} allowCartRoute={allowCartRoute} cartHref={cartHref} cartCount={cartCount} onOpen={() => setCartOpen(true)} />

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
              <ProductDetailOne
                product={detailModel}
                variant={config.variants.productPage}
                className="mx-auto max-w-none p-0 sm:p-0"
                onAddToCart={(quantity) => {
                  if (selected) addToCart(selected, quantity)
                  setDetailOpen(false)
                }}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className={config.variants.cartStyle === "minimal" ? "max-h-[88vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-3xl" : "max-h-[88vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg"} showCloseButton>
          <DialogHeader>
            <DialogTitle>Your cart</DialogTitle>
            <DialogDescription>Adjust quantities or remove items. Cart is persisted in localStorage.</DialogDescription>
          </DialogHeader>
          {Object.keys(lines).length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty. Add any product from the collection.</p>
          ) : (
            <div className={config.variants.cartStyle === "minimal" ? "grid gap-4 md:grid-cols-2" : "flex flex-col gap-4"}>
              {Object.values(lines).map((line) => (
                <ShoppingCartOne key={line.id} line={line} onQuantityChange={(quantity) => setLineQty(line.id, quantity)} onRemove={() => removeLine(line.id)} />
              ))}
            </div>
          )}
          {allowCartRoute ? (
            <div className="flex justify-end">
              <Button variant="outline" asChild>
                <Link href={cartHref}>Open cart page</Link>
              </Button>
            </div>
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

function SearchPanel(props: SearchUiProps) {
  return (
    <div className="border border-zinc-200 bg-[var(--store-panel)] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-zinc-900 sm:text-base">Search, filter, and sort</h4>
        <p className="text-xs text-zinc-500">{props.filteredCount} results</p>
      </div>
      <SearchInput searchQuery={props.searchQuery} onSearchChange={props.onSearchChange} />
      <FilterChips {...props} />
    </div>
  )
}

function MinimalSearchBar(props: SearchUiProps) {
  return (
    <div className="border-y border-zinc-200 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-xl">
          <SearchInput searchQuery={props.searchQuery} onSearchChange={props.onSearchChange} minimal />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
          <span>{props.filteredCount} results</span>
          <span className="hidden sm:inline">/</span>
          <SortButtons sortOrder={props.sortOrder} onSortChange={props.onSortChange} minimal />
        </div>
      </div>
      <div className="mt-4">
        <CategoryButtons activeCategory={props.activeCategory} categoryTags={props.categoryTags} onCategoryChange={props.onCategoryChange} minimal />
      </div>
    </div>
  )
}

type SearchUiProps = {
  searchQuery: string
  activeCategory: string | null
  categoryTags: string[]
  filteredCount: number
  sortOrder: SortOrder
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string | null) => void
  onSortChange: (value: SortOrder) => void
}

function SearchInput({
  searchQuery,
  onSearchChange,
  minimal = false,
}: {
  searchQuery: string
  onSearchChange: (value: string) => void
  minimal?: boolean
}) {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        className={minimal ? "h-11 rounded-none border-zinc-200 bg-white pl-11 pr-11" : "h-11 rounded-xl border-zinc-200 bg-white pl-11 pr-11"}
      />
      {searchQuery ? (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          onClick={() => onSearchChange("")}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

function FilterChips(props: SearchUiProps) {
  return (
    <>
      <div className="mt-3 flex flex-wrap gap-2">
        <CategoryButtons activeCategory={props.activeCategory} categoryTags={props.categoryTags} onCategoryChange={props.onCategoryChange} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SortButtons sortOrder={props.sortOrder} onSortChange={props.onSortChange} />
      </div>
    </>
  )
}

function CategoryButtons({
  activeCategory,
  categoryTags,
  onCategoryChange,
  minimal = false,
}: {
  activeCategory: string | null
  categoryTags: string[]
  onCategoryChange: (value: string | null) => void
  minimal?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant={activeCategory === null ? "default" : "outline"} size="sm" className={minimal ? "rounded-none" : "rounded-full"} onClick={() => onCategoryChange(null)}>
        All
      </Button>
      {categoryTags.map((tag) => (
        <Button key={tag} variant={activeCategory === tag ? "default" : "outline"} size="sm" className={minimal ? "rounded-none" : "rounded-full"} onClick={() => onCategoryChange(activeCategory === tag ? null : tag)}>
          {tag}
        </Button>
      ))}
    </div>
  )
}

function SortButtons({
  sortOrder,
  onSortChange,
  minimal = false,
}: {
  sortOrder: SortOrder
  onSortChange: (value: SortOrder) => void
  minimal?: boolean
}) {
  const buttonClass = minimal ? "rounded-none px-0 hover:bg-transparent" : "rounded-full"
  return (
    <>
      <Button variant={sortOrder === "featured" ? "secondary" : "outline"} size="sm" className={buttonClass} onClick={() => onSortChange("featured")}>Featured</Button>
      <Button variant={sortOrder === "price-asc" ? "secondary" : "outline"} size="sm" className={buttonClass} onClick={() => onSortChange("price-asc")}>Price: Low to high</Button>
      <Button variant={sortOrder === "price-desc" ? "secondary" : "outline"} size="sm" className={buttonClass} onClick={() => onSortChange("price-desc")}>Price: High to low</Button>
      <Button variant={sortOrder === "name" ? "secondary" : "outline"} size="sm" className={buttonClass} onClick={() => onSortChange("name")}>Name</Button>
    </>
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {config.categories.map((category) => (
              <CategoryListCard key={category.id} title={category.title} count={category.count || ""} imageSrc={category.image || ""} onClick={() => selectCategory(category)} />
            ))}
          </div>
        ) : null}

        {config.variants.categories === "circle" ? (
          <CategoryFour categories={config.categories.map((category) => ({ title: category.title, image: category.image, status: category.title.toLowerCase().includes("new") ? "live" : "default", onClick: () => selectCategory(category) }))} />
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
  renderCard,
}: {
  title: string
  description: string
  products: StoreProduct[]
  renderCard: (product: StoreProduct) => React.ReactNode
}) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Featured edit</p>
        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{title}</h3>
        <p className="mb-6 mt-2 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map(renderCard)}
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
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
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

        {props.products.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
            <p className="text-base font-medium text-zinc-900">No products in this merchandising bucket yet.</p>
            <p className="mt-1 text-sm text-zinc-600">Try another tab or add products with sale/new metadata.</p>
          </div>
        ) : (
          <ProductList
            products={props.products.map((product) => ({ ...product, href: props.productHref(product.slug) }))}
            badge="Merchandising"
            title={props.title}
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
      </div>
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

function FloatingCart({
  allowCartDialog,
  allowCartRoute,
  cartHref,
  cartCount,
  onOpen,
}: {
  allowCartDialog: boolean
  allowCartRoute: boolean
  cartHref: string
  cartCount: number
  onOpen: () => void
}) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative flex items-center gap-2">
        {allowCartRoute ? (
          <Button asChild variant="outline" className="rounded-full">
            <Link href={cartHref}>Cart page</Link>
          </Button>
        ) : null}
        <Button type="button" size="icon" className="size-14 rounded-full" onClick={onOpen} aria-label="Open cart" disabled={!allowCartDialog}>
          <ShoppingBag className="size-6" />
        </Button>
        {cartCount > 0 ? (
          <Badge className="absolute -right-1 -top-1 min-w-7 justify-center px-1.5">{cartCount > 99 ? "99+" : cartCount}</Badge>
        ) : null}
      </div>
    </div>
  )
}
