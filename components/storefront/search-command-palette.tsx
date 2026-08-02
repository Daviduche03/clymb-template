"use client"

import Link from "next/link"
import { Search, X } from "lucide-react"
import type { StoreProduct } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    results = [...results].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
  } else if (sortOrder === "name") {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name))
  }

  const showResults = !!query || !!activeCategory

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton>
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <DialogDescription className="sr-only">
          Search and filter products by name, category, and price.
        </DialogDescription>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
          <Input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products..."
            className="h-12 rounded-full border-zinc-200 bg-zinc-50 pl-11 pr-11"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        {categoryTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onCategoryChange(null)}
            >
              All
            </Button>
            {categoryTags.map((tag) => (
              <Button
                key={tag}
                variant={activeCategory === tag ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => onCategoryChange(activeCategory === tag ? null : tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-y border-zinc-100 py-3">
          <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Sort</span>
          <SortPill active={sortOrder === "featured"} onClick={() => onSortChange("featured")}>
            Featured
          </SortPill>
          <SortPill active={sortOrder === "price-asc"} onClick={() => onSortChange("price-asc")}>
            Price low–high
          </SortPill>
          <SortPill active={sortOrder === "price-desc"} onClick={() => onSortChange("price-desc")}>
            Price high–low
          </SortPill>
          <SortPill active={sortOrder === "name"} onClick={() => onSortChange("name")}>
            Name
          </SortPill>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-zinc-500">
              No products match your search.
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {results.slice(0, 8).map((product) => (
                <li key={product.slug}>
                  <Link
                    href={productHref(product.slug)}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-zinc-50"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-100">
                      <img src={product.image} alt={product.imgAlt || product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-zinc-900">{product.name}</p>
                      <p className="text-xs text-zinc-500">{product.badges.join(", ") || "Product"}</p>
                    </div>
                    <div className="text-sm font-semibold text-zinc-900">
                      {product.salePrice != null ? (
                        <span className="flex items-center gap-1.5">
                          <span className="text-red-600">${product.salePrice.toFixed(2)}</span>
                          <span className="text-xs font-normal text-zinc-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span>${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {limitResultsNote(showResults, results)}
      </DialogContent>
    </Dialog>
  )
}

function SortPill({
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
        "rounded-full px-3 py-1 text-sm transition-colors",
        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100",
      )}
    >
      {children}
    </button>
  )
}

function limitResultsNote(show: boolean, results: StoreProduct[]) {
  return show ? (
    <p className="px-2 text-xs text-zinc-400">
      {results.length > 8 ? "Showing the first 8 results." : `${results.length} result${results.length === 1 ? "" : "s"}`}
    </p>
  ) : null
}