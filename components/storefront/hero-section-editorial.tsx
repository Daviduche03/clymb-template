import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeroSectionEditorialProps = {
  badge?: string
  title?: string
  description?: string
  image?: string
}

export function HeroSectionEditorial({
  badge = "New collection",
  title = "Minimal essentials built to move.",
  description = "A quieter storefront hero with stronger typography, editorial spacing, and product-led focus.",
  image = "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1400&auto=format&fit=crop",
}: HeroSectionEditorialProps) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="flex flex-col justify-center py-10 lg:py-16">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-500">{badge}</p>
          <h1 className="mt-5 max-w-lg text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-zinc-950 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-zinc-600 sm:text-base">
            {description}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" className="h-12 rounded-none px-8 text-xs uppercase tracking-[0.24em]" asChild>
              <a href="#collection">Shop collection</a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-none border border-zinc-300 px-8 text-xs uppercase tracking-[0.24em] text-zinc-700 hover:bg-zinc-50"
              asChild
            >
              <a href="#categories">Browse categories</a>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Fabric-first</p>
              <p className="mt-2 text-sm text-zinc-900">Elevated essentials with durable finishing.</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Quiet design</p>
              <p className="mt-2 text-sm text-zinc-900">Minimal branding with cleaner silhouettes.</p>
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Daily wear</p>
              <p className="mt-2 text-sm text-zinc-900">Built for training, commute, and repeat use.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
          <div className="relative overflow-hidden bg-[var(--store-panel)]">
            <img src={image} alt={title} className="h-full min-h-[520px] w-full object-cover object-center" />
            <div className="absolute left-4 top-4 bg-white/95 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
              Editorial drop
            </div>
          </div>
          <div className="hidden flex-col justify-end gap-4 lg:flex">
            <div className="border border-zinc-200 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">Designed to last</p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Premium construction and restrained details over trend-led noise.
              </p>
            </div>
            <div className="flex items-center gap-2 border border-zinc-200 p-4 text-sm font-medium text-zinc-900">
              Explore more
              <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
