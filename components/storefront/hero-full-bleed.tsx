import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeroFullBleedProps = {
  badge?: string
  title?: string
  description?: string
  image?: string
}

const stats = [
  { value: "4.9/5", label: "Avg. rating" },
  { value: "50k+", label: "Orders fulfilled" },
  { value: "30d", label: "Free returns" },
]

export function HeroFullBleed({
  badge = "New season",
  title = "Train harder. Look sharper.",
  description = "High-performance essentials for every gym day — engineered for durability, designed for the long run.",
  image = "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1400&auto=format&fit=crop",
}: HeroFullBleedProps) {
  return (
    <section className="relative min-h-[70dvh] overflow-hidden bg-zinc-950">
      <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/20" />

      <div className="relative z-10 mx-auto flex min-h-[70dvh] max-w-7xl flex-col justify-end px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-300">{badge}</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300">{description}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" className="h-12 rounded-none px-8 text-xs uppercase tracking-[0.24em]" asChild>
            <a href="#collection">Shop collection</a>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-none border border-white/40 px-8 text-xs uppercase tracking-[0.24em] text-white hover:bg-white/10"
            asChild
          >
            <a href="#categories">Browse categories</a>
          </Button>
        </div>

        <div className="mt-14 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-white">{stat.value}</p>
              <p className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-zinc-400">
                {stat.label}
                <ArrowRight className="ml-1 inline size-3 text-zinc-500" />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}