import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type StoryStatus = "default" | "live";

type CategoryItem = {
  title: string
  image?: string
  status?: StoryStatus
  onClick?: () => void
}

export function CategoryFour({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="w-full overflow-hidden">
      <div className="flex items-center justify-start flex-wrap gap-6 md:gap-10 pb-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className="flex flex-col items-center gap-3 cursor-pointer group shrink-0"
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
            <div
              className={cn(
                "relative size-20 md:size-24 lg:size-28 rounded-full p-1 transition-all duration-300 group-hover:scale-110",
                category.status === "live" 
                  ? "bg-gradient-to-tr from-primary via-primary/80 to-accent"
                  : "bg-gray-200 dark:bg-neutral-800"
              )}
            >
              <img
                src={category.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"}
                alt={category.title}
                className="size-full rounded-full object-cover ring-2 ring-white dark:ring-neutral-950"
              />
              {category.status === "live" && (
                <>
                  <div className="absolute inset-1 rounded-full bg-black/20 flex items-center justify-center">
                    <Play className="size-5 text-white fill-white" />
                  </div>
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-500 text-white text-[10px] font-bold border-2 border-white dark:border-neutral-950 px-1 py-0 h-4">
                    LIVE
                  </Badge>
                </>
              )}
            </div>
            <span className="text-sm md:text-base font-semibold text-center group-hover:text-primary transition-colors">
              {category.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
