import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StoreCategory } from "@/lib/storefront-data"

export function CategorySectionSplit({
  categories,
  onSelect,
}: {
  categories: StoreCategory[]
  onSelect?: (category: StoreCategory) => void
}) {
  const featured = categories[0]
  const secondary = categories.slice(1, 5)

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {featured ? (
        <button
          type="button"
          onClick={() => onSelect?.(featured)}
          className="group relative min-h-[420px] overflow-hidden bg-[var(--store-panel)] text-left"
        >
          <img src={featured.image || ""} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-white/70">Featured collection</p>
            <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{featured.title}</h3>
            {featured.count ? <p className="mt-3 text-sm text-white/90">{featured.count}</p> : null}
          </div>
        </button>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        {secondary.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect?.(category)}
            className={cn("group flex items-center gap-4 border border-zinc-200 bg-white p-4 text-left transition-colors hover:bg-zinc-50")}
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden bg-[var(--store-panel)]">
              <img src={category.image || ""} alt={category.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">Category</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">{category.title}</h3>
              {category.count ? <p className="mt-2 text-sm text-zinc-600">{category.count}</p> : null}
            </div>
            <ArrowRight className="size-4 text-zinc-500 transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </div>
  )
}
