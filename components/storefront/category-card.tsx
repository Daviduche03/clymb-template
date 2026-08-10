import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CategoryCardProps {
  title: string
  count: string
  imageSrc: string
  className?: string
  onClick?: () => void
}

export function CategoryCard({ title, count, imageSrc, className, onClick }: CategoryCardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        "group relative flex h-56 cursor-pointer flex-col justify-end overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
        className,
      )}
    >
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative bottom-0 left-0 flex w-full items-end justify-between gap-4 p-6">
        <div className="shrink-0">
          <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h3>
          <p className="mt-1 text-sm font-medium text-white/80">{count}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}