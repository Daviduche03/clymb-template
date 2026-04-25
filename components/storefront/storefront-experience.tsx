"use client"

import Link from "next/link"
import { useCallback, useMemo, useState } from "react"
import { CategoryCard } from "@/components/commercn/categories/category-01"
import { CategoryListCard } from "@/components/commercn/categories/category-02"
import { CategoryFour } from "@/components/commercn/categories/category-04"
import { ProductCardOne } from "@/components/commercn/product-cards/product-card-01"
import { ProductCardTwo } from "@/components/commercn/product-cards/product-card-02"
import { ProductCardThree } from "@/components/commercn/product-cards/product-card-03"
import { ProductDetailOne } from "@/components/commercn/product-details/product-detail-01"
import { ShoppingCartOne } from "@/components/commercn/carts/cart-01"
import ProductList from "@/components/shadcn-studio/blocks/product-list-01/product-list-01"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { StorefrontConfig, StoreProduct } from "@/lib/storefront-data"
import { productToDetailModel, toCartLine } from "@/lib/storefront-data"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { ArrowRight, Search, ShoppingBag, X } from "lucide-react"

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
  const [merchTab, setMerchTab] = useState<"new" | "best" | "sale">("new")
  const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured")

  const { lines, cartCount, addToCart: addToCartBase, setLineQty, removeLine } = useCart(config.id)
  const { isWishlisted: isSlugWishlisted, toggleWishlist: toggleSlugWishlist } = useWishlist(config.id)

  const detailModel = useMemo(
    () => (selected ? productToDetailModel(selected) : null),
    [selected],
  )

  const allowDetailDialog = config.variants.productDetails === "dialog" || config.variants.productDetails === "both"
  const allowDetailRoute = config.variants.productDetails === "route" || config.variants.productDetails === "both"
  const allowCartDialog = config.variants.cart === "dialog" || config.variants.cart === "both"
  const allowCartRoute = config.variants.cart === "route" || config.variants.cart === "both"

  const productHref = (slug: string) => `${basePath}/products/${slug}`
  const cartHref = `${basePath}/cart`

  const getInventory = useCallback((product: StoreProduct) => product.inventory ?? 12, [])
  const isOutOfStock = useCallback((product: StoreProduct) => getInventory(product) <= 0, [getInventory])
  const isLowStock = useCallback(
    (product: StoreProduct) => getInventory(product) > 0 && getInventory(product) <= 3,
    [getInventory],
  )

  const addToCart = useCallback((product: StoreProduct, qty: number) => {
    if (isOutOfStock(product)) return
    addToCartBase(toCartLine(product, qty))
    if (allowCartDialog) setCartOpen(true)
  }, [allowCartDialog, addToCartBase, isOutOfStock])

  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })
  }

  const activateCategory = (category: string | null) => {
    setActiveCategory(category)
    scrollToCollection()
  }

  const onProductClick = (p: StoreProduct) => {
    if (allowDetailDialog) {
      setSelected(p)
      setDetailOpen(true)
    }
  }

  const showProductCardThree = config.variants.productCards === "product-card-03"

  // Derive unique category tags from product badges
  const categoryTags = useMemo(() => {
    const tags = new Set<string>()
    config.products.forEach((p) => p.badges.forEach((b) => tags.add(b)))
    return [...tags]
  }, [config.products])

  const categoryTagByTitle = useMemo(() => {
    const entries = config.categories.map((category) => {
      const normalizedTitle = category.title.toLowerCase()
      const matchingTag = categoryTags.find((tag) => normalizedTitle.includes(tag.toLowerCase()))
      return [category.title, matchingTag ?? null] as const
    })

    return new Map(entries)
  }, [categoryTags, config.categories])

  // Filter products by search query and active category
  const filteredProducts = useMemo(() => {
    let result = config.products
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.badges.some((b) => b.toLowerCase().includes(q))
      )
    }
    if (activeCategory) {
      result = result.filter((p) => p.badges.includes(activeCategory))
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

  const inStockCount = useMemo(
    () => config.products.filter((product) => !isOutOfStock(product)).length,
    [config.products, isOutOfStock],
  )

  const merchProducts = useMemo(() => {
    const all = config.products
    if (merchTab === "sale") {
      return all.filter((p) => p.salePrice != null)
    }
    if (merchTab === "new") {
      const taggedNew = all.filter((p) => p.badges.some((b) => b.toLowerCase() === "new"))
      return taggedNew.length > 0 ? taggedNew : all.slice(0, 6)
    }
    const byValue = [...all].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
    return byValue.slice(0, 6)
  }, [config.products, merchTab])

  // Wishlist helpers that work with ProductItem (which has .name but not .slug)
  const isProductWishlisted = useCallback(
    (p: { name: string }) => {
      const match = config.products.find((sp) => sp.name === p.name)
      return match ? isSlugWishlisted(match.slug) : false
    },
    [config.products, isSlugWishlisted],
  )

  const toggleProductWishlist = useCallback(
    (p: { name: string }) => {
      const match = config.products.find((sp) => sp.name === p.name)
      if (match) toggleSlugWishlist(match.slug)
    },
    [config.products, toggleSlugWishlist],
  )

  return (
    <>
      <section id="categories" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row lg:mb-10">
            <div className="flex flex-col gap-1">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Collections</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950">Shop by category</h2>
              <p className="max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
                Refined edits for a quieter, more editorial browsing experience.
              </p>
            </div>
            <Button className="group rounded-none px-0 text-xs uppercase tracking-[0.22em] text-zinc-950 hover:bg-transparent" variant="ghost" asChild>
              <a href="#collection" onClick={(e) => { e.preventDefault(); scrollToCollection() }}>
                View all products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          {config.variants.categories === "cards" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {config.categories.map((c) => (
                <CategoryCard
                  key={c.id}
                  title={c.title}
                  count={c.count || ""}
                  imageSrc={c.image || ""}
                  onClick={() => activateCategory(categoryTagByTitle.get(c.title) ?? null)}
                />
              ))}
            </div>
          )}

          {config.variants.categories === "list" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {config.categories.map((c) => (
                <CategoryListCard
                  key={c.id}
                  title={c.title}
                  count={c.count || ""}
                  imageSrc={c.image || ""}
                  onClick={() => activateCategory(categoryTagByTitle.get(c.title) ?? null)}
                />
              ))}
            </div>
          )}

          {config.variants.categories === "circle" && (
            <CategoryFour 
              categories={config.categories.map(c => ({ 
                title: c.title, 
                image: c.image,
                status: c.title.toLowerCase().includes("new") ? "live" : "default",
                onClick: () => activateCategory(categoryTagByTitle.get(c.title) ?? null),
              }))} 
            />
          )}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Featured edit</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">Featured products</h3>
          <p className="mb-6 mt-2 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
            A tighter front-of-store selection with calmer spacing and stronger product emphasis.
          </p>
          <div
            className={
              showProductCardThree
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {config.products.slice(0, 3).map((p) => {
              const detail = productToDetailModel(p)
              const cardProps = {
                id: p.slug,
                name: detail.name,
                category: detail.category,
                description: detail.description,
                price: detail.currentPrice,
                image: detail.images[0],
                isInCart: Boolean(lines[p.slug]),
                isOutOfStock: isOutOfStock(p),
                lowStockText: isLowStock(p) ? `Only ${getInventory(p)} left` : undefined,
                onClick: () => {
                  if (allowDetailRoute) {
                    window.location.href = productHref(p.slug)
                  } else if (allowDetailDialog) {
                    setSelected(p)
                    setDetailOpen(true)
                  }
                },
                onAddToCart: () => addToCart(p, 1),
              }

              if (config.variants.productCards === "product-card-01") {
                return <ProductCardOne key={p.slug} {...cardProps} />
              }
              if (config.variants.productCards === "product-card-03") {
                return (
                  <div key={p.slug} className="w-full justify-self-stretch">
                    <ProductCardThree {...cardProps} />
                  </div>
                )
              }
              return <ProductCardTwo key={p.slug} {...cardProps} />
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">Merchandising</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">Collection highlights</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Switch between merchandising views to spotlight different buying intents.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant={merchTab === "new" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setMerchTab("new")}
              >
                New arrivals
              </Button>
              <Button
                size="sm"
                variant={merchTab === "best" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setMerchTab("best")}
              >
                Best sellers
              </Button>
              <Button
                size="sm"
                variant={merchTab === "sale" ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setMerchTab("sale")}
              >
                On sale
              </Button>
            </div>
          </div>

          {merchProducts.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
              <p className="text-base font-medium text-zinc-900">No products in this merchandising bucket yet.</p>
              <p className="mt-1 text-sm text-zinc-600">
                Try another tab or add products with sale/new metadata.
              </p>
            </div>
          ) : (
            <ProductList
              products={merchProducts.map((p) => ({
                ...p,
                href: productHref(p.slug),
              }))}
              badge="Merchandising"
              title={
                merchTab === "new"
                  ? "New arrivals"
                  : merchTab === "best"
                    ? "Best sellers"
                    : "On sale"
              }
              compact
              onProductClick={
                allowDetailDialog
                  ? (p) => {
                      onProductClick(p as StoreProduct)
                    }
                  : undefined
              }
              onAddToCart={(p) => addToCart(p as StoreProduct, 1)}
              isWishlisted={isProductWishlisted}
              onToggleWishlist={toggleProductWishlist}
              isInCart={(p) => !!lines[p.slug]}
              isOutOfStock={(p) => isOutOfStock(p as StoreProduct)}
              isLowStock={(p) => isLowStock(p as StoreProduct)}
            />
          )}
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative flex items-center gap-2">
          {allowCartRoute && (
            <Button asChild variant="outline" className="rounded-full">
              <Link href={cartHref}>Cart page</Link>
            </Button>
          )}
          <Button
            type="button"
            size="icon"
            className="size-14 rounded-full"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            disabled={!allowCartDialog}
          >
            <ShoppingBag className="size-6" />
          </Button>
          {cartCount > 0 ? (
            <Badge className="absolute -right-1 -top-1 min-w-7 justify-center px-1.5">
              {cartCount > 99 ? "99+" : cartCount}
            </Badge>
          ) : null}
        </div>
      </div>

      <div id="collection" className="bg-white pb-16 sm:pb-20">
        <div className="mx-auto max-w-7xl space-y-4 px-4 pt-12 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-zinc-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Catalog size</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{config.products.length}</p>
              <p className="mt-1 text-sm text-zinc-600">Curated products ready for merchandising.</p>
            </div>
            <div className="border border-zinc-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">In stock</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-950">{inStockCount}</p>
              <p className="mt-1 text-sm text-zinc-600">Items available for immediate checkout.</p>
            </div>
            <div className="border border-zinc-200 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Active filter</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950">{activeCategory ?? "All products"}</p>
              <p className="mt-1 text-sm text-zinc-600">Use filters to switch merchandising intent quickly.</p>
            </div>
          </div>

          <div className="border border-zinc-200 bg-[var(--store-panel)] p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-zinc-900 sm:text-base">Search, filter, and sort</h4>
              <p className="text-xs text-zinc-500">
                {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 rounded-xl border-zinc-200 bg-white pl-11 pr-11 text-sm placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:ring-zinc-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(null)}
              >
                All
              </Button>
              {categoryTags.map((tag) => (
                <Button
                  key={tag}
                  variant={activeCategory === tag ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setActiveCategory(activeCategory === tag ? null : tag)}
                >
                  {tag}
                </Button>
              ))}
              {(searchQuery || activeCategory) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-zinc-700 hover:bg-zinc-100"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory(null)
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={sortOrder === "featured" ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSortOrder("featured")}
              >
                Featured
              </Button>
              <Button
                variant={sortOrder === "price-asc" ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSortOrder("price-asc")}
              >
                Price: Low to high
              </Button>
              <Button
                variant={sortOrder === "price-desc" ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSortOrder("price-desc")}
              >
                Price: High to low
              </Button>
              <Button
                variant={sortOrder === "name" ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSortOrder("name")}
              >
                Name
              </Button>
            </div>
          </div>
        </div>

        {config.products.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-semibold text-zinc-900">No products yet</p>
            <p className="mt-1 text-sm text-zinc-600">
              This storefront has no catalog items yet. Add products in store data to populate this section.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="text-lg font-semibold text-zinc-900">
              No matches found{searchQuery ? ` for "${searchQuery}"` : ""}.
            </p>
            <p className="mt-1 text-sm text-zinc-600">
              Try a different keyword, remove category filters, or browse highlighted collections above.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setActiveCategory(null) }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <ProductList
            products={filteredProducts.map((p) => ({
              ...p,
              href: productHref(p.slug),
            }))}
            badge={config.name}
            title={config.heroTitle}
            onProductClick={
              allowDetailDialog
                ? (p) => {
                    onProductClick(p as StoreProduct)
                  }
                : undefined
            }
            onAddToCart={(p) => addToCart(p as StoreProduct, 1)}
            isWishlisted={isProductWishlisted}
            onToggleWishlist={toggleProductWishlist}
            isInCart={(p) => !!lines[p.slug]}
            isOutOfStock={(p) => isOutOfStock(p as StoreProduct)}
            isLowStock={(p) => isLowStock(p as StoreProduct)}
          />
        )}
      </div>



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
                className="mx-auto max-w-none p-0 sm:p-0"
                onAddToCart={(qty) => {
                  if (selected) addToCart(selected, qty)
                  setDetailOpen(false)
                }}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-h-[88vh] max-w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle>Your cart</DialogTitle>
            <DialogDescription>Adjust quantities or remove items. Cart is persisted in localStorage.</DialogDescription>
          </DialogHeader>
          {Object.keys(lines).length === 0 ? (
            <p className="text-muted-foreground text-sm">Your cart is empty. Add any product from the collection.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.values(lines).map((line) => (
                <ShoppingCartOne
                  key={line.id}
                  line={line}
                  onQuantityChange={(q) => setLineQty(line.id, q)}
                  onRemove={() => removeLine(line.id)}
                />
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
