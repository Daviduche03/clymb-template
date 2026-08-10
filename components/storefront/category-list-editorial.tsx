import { ArrowRight } from "lucide-react"
import type { StoreCategory } from "@/lib/types"

export function CategoryListEditorial({
  categories,
  onSelect,
}: {
  categories: StoreCategory[]
  onSelect?: (category: StoreCategory) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect?.(category)}
          className="group flex items-center gap-5 border border-zinc-200 bg-white p-5 text-left transition-colors hover:bg-zinc-50"
        >
          <div className="h-28 w-28 shrink-0 overflow-hidden bg-[var(--store-panel)]">
            <img
              src={category.image || ""}
              alt={category.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-zinc-500">Category</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-zinc-950">{category.title}</h3>
            {category.count ? <p className="mt-2 text-sm text-zinc-600">{category.count}</p> : null}
          </div>
          <ArrowRight className="size-5 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-1" />
        </button>
      ))}
    </div>
  )
}