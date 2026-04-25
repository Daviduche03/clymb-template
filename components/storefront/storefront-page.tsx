import { PromoBannerOne } from "@/components/commercn/promo-banners/promo-banner-01"
import { PromoBannerThree } from "@/components/commercn/promo-banners/promo-banner-03"
import { StorefrontExperience } from "@/components/storefront/storefront-experience"
import { StoreThemeProvider } from "@/components/storefront/store-theme-provider"
import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import HeroSection01 from "@/components/shadcn-studio/blocks/hero-section-01/hero-section-01"
import HeroSection41 from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41"
import type { MenuData } from "@/components/shadcn-studio/blocks/hero-section-41/hero-section-41"
import type { StorefrontConfig } from "@/lib/storefront-data"
import { mapNavigationForStore } from "@/lib/storefront-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const hero41MenuData: MenuData[] = [
  {
    id: 1,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-18.png",
    imgAlt: "plate-1",
    userComment: "The ambiance is perfect and the food is absolutely delicious. Highly recommended!",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-56.png",
  },
  {
    id: 2,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-19.png",
    imgAlt: "plate-2",
    userComment: "Best dining experience in town. The staff is friendly and the menu is exceptional.",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-46.png",
  },
  {
    id: 3,
    img: "https://cdn.shadcnstudio.com/ss-assets/template/landing-page/bistro/image-20.png",
    imgAlt: "plate-3",
    userComment: "Every dish is crafted with care. This place never disappoints!",
    userAvatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-57.png",
  },
]

import Footer01 from "@/components/shadcn-studio/blocks/footer-component-01/footer-component-01"
import Footer02 from "@/components/shadcn-studio/blocks/footer-component-01/footer-component-02"

function HeroSectionVariant({ store }: { store: StorefrontConfig }) {
  if (store.variants.hero === "hero-section-01") {
    return (
      <HeroSection01
        badge={store.heroBadge}
        title={store.heroTitle}
        description={store.heroDescription}
        image={store.heroImage}
      />
    )
  }

  if (store.variants.hero === "hero-section-41") {
    return (
      <section className="overflow-x-hidden bg-white py-16 sm:py-20">
        <HeroSection41
          menudata={hero41MenuData}
          title={store.heroTitle}
          description={store.heroDescription}
        />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden border-b bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,var(--color-indigo-100),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_right,var(--color-indigo-950),transparent_55%)]/[30]" />
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div className="space-y-5">
          <Badge>{store.heroBadge}</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{store.heroTitle}</h1>
          <p className="text-muted-foreground max-w-xl text-base sm:text-lg">{store.heroDescription}</p>
          <div className="flex gap-3">
            <Button asChild>
              <a href="#collection">Shop collection</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="#categories">Browse categories</a>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border bg-white">
          <img src={store.heroImage} alt={store.name} className="h-[360px] w-full object-contain p-8" />
        </div>
      </div>
    </section>
  )
}

function FooterVariant({ store, basePath }: { store: StorefrontConfig; basePath: string }) {
  const homeHref = basePath || "/"
  const cartHref = `${basePath}/cart`

  if (store.variants.footer === "footer-02") {
    return <Footer02 storeName={store.name} logoUrl={store.theme?.logoUrl} homeHref={homeHref} cartHref={cartHref} />
  }
  return <Footer01 storeName={store.name} logoUrl={store.theme?.logoUrl} homeHref={homeHref} />
}

export function StorefrontPage({
  store,
  basePath,
}: {
  store: StorefrontConfig
  basePath: string
}) {
  const navigation = mapNavigationForStore(basePath, store.navigation)

  return (
    <StoreThemeProvider config={store}>
      <main className="min-h-screen bg-white">
        {store.variants.banner === "promo-03" ? <PromoBannerThree /> : null}
        {store.variants.banner === "promo-01" ? <PromoBannerOne /> : null}

        <Header navigationData={navigation} logoUrl={store.theme?.logoUrl} homeHref={basePath || "/"} />
        <HeroSectionVariant store={store} />

        <StorefrontExperience config={store} basePath={basePath} />
        <FooterVariant store={store} basePath={basePath} />
      </main>
    </StoreThemeProvider>
  )
}
