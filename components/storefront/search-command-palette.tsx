"use client"

import Link from "next/link"
import { Search, X, ArrowUpRight } from "lucide-react"
import type { StoreProduct } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type SearchSortOrder = "featured" | "price-asc" | "price-desc" | "name"

type SearchCommandPaletteProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  products: StoreProduct[]
  productHref: (slug: string) => string
  searchQuery: string
  activeCategory: string | null
  categoryTags: string[]
  sortOrder: SearchSortOrder
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string | null) => void
  onSortChange: (value: SearchSortOrder) => void
}

export function SearchCommandPalette({
  open,
  onOpenChange,
  products,
  productHref,
  searchQuery,
  activeCategory,
  categoryTags,
  sortOrder,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: SearchCommandPaletteProps) {
  const query = searchQuery.trim().toLowerCase()

  let results = products
  if (query) {
    results = results.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.badges.some((badge) => badge.toLowerCase().includes(query)),
    )
  }
  if (activeCategory) {
    results = results.filter((product) => product.badges.includes(activeCategory))
  }
  if (sortOrder === "price-asc") {
    results = [...results].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
  } else if (sortOrder === "price-desc") {
    results = [...results].sort((a, b) => (b.salePrice ?? a.price) - (a.salePrice ?? a.price))
  } else if (sortOrder === "name") {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name))
  }

  const showResults = !!query || !!activeCategory

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-none border border-zinc-200 bg-white p-0 shadow-xl sm:max-w-2xl" showCloseButton>
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <DialogDescription className="sr-only">
          Search and filter products by name, category, and price.
        </DialogDescription>

        <div className="border-b border-zinc-200 px-6 pb-5 pt-8">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-400">
            Search the store
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-0 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Type to search products, e.g. dumbbell"
              className="h-14 w-full rounded-none border-b-2 border-zinc-900 bg-transparent pb-2 pl-9 pr-10 text-2xl font-medium tracking-[-0.02em] text-zinc-950 placeholder:text-zinc-300 focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-zinc-400 transition-colors hover:text-zinc-900"
              >
                <X className="size-5" />
              </button>
            ) : null}
          </div>

          {categoryTags.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <CategoryTag
                active={activeCategory === null}
                onClick={() => onCategoryChange(null)}
              >
                All
              </CategoryTag>
              {categoryTags.map((tag) => (
                <CategoryTag
                  key={tag}
                  active={activeCategory === tag}
                  onClick={() => onCategoryChange(activeCategory === tag ? null : tag)}
                >
                  {tag}
                </CategoryTag>
              ))}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-400">
              Sort
            </span>
            <SortLink active={sortOrder === "featured"} onClick={() => onSortChange("featured")}>
              Featured
            </SortLink>
            <SortLink active={sortOrder === "price-asc"} onClick={() => onSortChange("price-asc")}>
              Price low–high
            </SortLink>
            <SortLink active={sortOrder === "price-desc"} onClick={() => onSortChange("price-desc")}>
              Price high–low
            </SortLink>
            <SortLink active={sortOrder === "name"} onClick={() => onSortChange("name")}>
              Name
            </SortLink>
          </div>
        </div>

        <div className="max-h-[26rem] overflow-y-auto px-6 py-2">
          {results.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
                No matches{query ? ` for "${searchQuery}"` : ""}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Try a different keyword or remove the {activeCategory ? "category filter" : "filters"}.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {results.slice(0, 8).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={productHref(product.slug)}
                    onClick={() => onOpenChange(false)}
                    className="group flex items-center gap-5 px-1 py-4 transition-colors"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden bg-zinc-100">
                      <img
                        src={product.image}
                        alt={product.imgAlt || product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium tracking-[-0.01em] text-zinc-950">
                        {product.name}
                      </p>
                      <p className="mt-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-zinc-400">
                        {product.badges.join(" · ") || "Product"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {product.salePrice != null ? (
                          <>
                            <p className="text-sm font-medium text-zinc-950">
                              ${product.salePrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-zinc-400 line-through">
                              ${product.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm font-medium text-zinc-950">
                            ${product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <ArrowUpRight className="size-4 text-zinc-300 transition-colors group-hover:text-zinc-900" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3">
          <p className="text-xs text-zinc-400">
            {showResults
              ? results.length > 8
                ? "Showing the first 8 results."
                : `${results.length} ${results.length === 1 ? "result" : "results"}`
              : `${products.length} products in the store`}
          </p>
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-zinc-300">
            esc to close
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CategoryTag({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-none border px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-zinc-900 bg-zinc-950 text-white"
          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950",
      )}
    >
      {children}
    </button>
  )
}

function SortLink({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-xs font-medium transition-colors",
        active
          ? "text-zinc-950 underline underline-offset-4"
          : "text-zinc-400 hover:text-zinc-950",
      )}
    >
      {children}
    </button>
  )
}