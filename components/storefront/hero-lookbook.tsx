import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type HeroLookbookProps = {
  badge?: string
  title?: string
  description?: string
  image?: string
  imageAlt?: string
}

const features = [
  {
    label: "01",
    title: "Performance",
    text: "Engineered fabrics with tested durability.",
  },
  {
    label: "02",
    title: "Restraint",
    text: "Clean lines and a considered silhouette.",
  },
  {
    label: "03",
    title: "Longevity",
    text: "Stitched to outlast seasonal trends.",
  },
]

export function HeroLookbook({
  badge = "Lookbook 001",
  title = "Designed for the daily, built to be repeated.",
  description = "A closer look at the pieces that anchor every rotation — silhouettes that move from rest to rep without compromise.",
  image = "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=1400&auto=format&fit=crop",
  imageAlt = "Store hero lookbook",
}: HeroLookbookProps) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-10 flex items-center justify-between gap-6">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.26em] text-zinc-400">{badge}</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              aria-label="Previous slide"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-950 hover:text-zinc-950"
              aria-label="Next slide"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-zinc-950 sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-md text-sm leading-6 text-zinc-600 sm:text-base">{description}</p>
            <div className="mt-10">
              <Button size="lg" className="h-12 rounded-none px-8 text-xs uppercase tracking-[0.24em]" asChild>
                <a href="#collection">Explore the drop</a>
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[var(--store-panel)]">
            <img src={image} alt={imageAlt} className="h-full min-h-[560px] w-full object-cover object-center" />
            <div className="absolute bottom-5 left-5 flex items-center gap-3">
              <span className="border border-zinc-200 bg-white/95 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-zinc-500">
                No. 01 — Lead
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px border border-zinc-200 bg-zinc-200 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.label} className="flex flex-col gap-2 bg-white p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-zinc-400">{feature.label}</p>
              <p className="text-sm font-medium uppercase tracking-[0.14em] text-zinc-900">{feature.title}</p>
              <p className="text-sm leading-6 text-zinc-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}