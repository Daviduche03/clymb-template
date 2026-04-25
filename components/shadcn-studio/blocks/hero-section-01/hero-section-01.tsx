import { Button } from '@/components/ui/button'

type HeroSectionProps = {
  badge?: string
  title?: string
  description?: string
  image?: string
}

const HeroSection = ({
  badge = "AI-Powered",
  title = "Sizzling Summer Delights",
  description = "Dive into a world of flavor this summer with our collection of Sizzling Summer Delights!",
  image = "https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/hero/image-19.png",
}: HeroSectionProps) => {
  return (
    <section className="overflow-x-hidden border-b bg-white">
      <div className="mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1.05fr_1.35fr] lg:gap-8 lg:px-8">
        <div className="flex flex-col justify-center py-8 lg:py-14">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-10 bg-zinc-300" />
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
              {badge}
            </span>
          </div>

          <h1 className="max-w-lg text-4xl font-semibold leading-[0.95] text-zinc-950 sm:text-5xl lg:text-[5rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-md text-sm leading-6 text-zinc-600 sm:text-base">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button size="lg" className="h-11 rounded-none px-8 text-xs uppercase tracking-[0.24em]" asChild>
              <a href="#collection">Shop Collection</a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-11 rounded-none border border-zinc-300 px-8 text-xs uppercase tracking-[0.24em] text-zinc-700 hover:bg-zinc-50"
              asChild
            >
              <a href="#categories">Browse Categories</a>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[var(--store-panel)]">
          <div className="absolute left-4 top-4 z-10 bg-white/90 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
            New arrival
          </div>
          <img
            src={image}
            alt={title}
            className="h-full min-h-[460px] w-full object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
