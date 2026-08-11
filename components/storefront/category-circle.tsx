import { cn } from "@/lib/utils"

type CategoryItem = {
  title: string
  image?: string
  onClick?: () => void
}

export function CategoryCircle({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="w-full overflow-hidden">
      <div className="flex items-center justify-start gap-6 pb-4 md:gap-10">
        {categories.map((category) => (
          <div
            key={category.title}
            className="group flex shrink-0 cursor-pointer flex-col items-center gap-3"
            role={category.onClick ? "button" : undefined}
            tabIndex={category.onClick ? 0 : undefined}
            onClick={category.onClick}
            onKeyDown={(e) => {
              if (!category.onClick) return
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                category.onClick()
              }
            }}
          >
            <div className="relative size-20 rounded-full border border-zinc-200 bg-zinc-100 p-0.5 transition-transform duration-300 group-hover:scale-105 md:size-24 lg:size-28">
              <img
                src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"}
                alt={category.title}
                loading="lazy"
                decoding="async"
                className="size-full rounded-full object-cover"
              />
            </div>
            <span className="text-center text-sm font-semibold text-zinc-950 transition-colors group-hover:text-zinc-600 md:text-base">
              {category.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}