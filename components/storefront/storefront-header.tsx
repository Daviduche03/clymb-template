import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { HeaderEditorialMinimal } from "@/components/storefront/header-editorial-minimal"
import { HeaderPerformance } from "@/components/storefront/header-performance"
import type { StorefrontConfig } from "@/lib/storefront-data"

type StorefrontHeaderProps = {
  store: StorefrontConfig
  navigation: NavigationSection[]
  basePath: string
  className?: string
}

export function StorefrontHeader({
  store,
  navigation,
  basePath,
  className,
}: StorefrontHeaderProps) {
  const homeHref = basePath || "/"

  if (store.variants.header === "header-03") {
    return (
      <HeaderEditorialMinimal
        navigationData={navigation}
        logoUrl={store.theme?.logoUrl}
        storeName={store.name}
        homeHref={homeHref}
        className={className}
      />
    )
  }

  if (store.variants.header === "header-02") {
    return (
      <HeaderPerformance
        navigationData={navigation}
        logoUrl={store.theme?.logoUrl}
        storeName={store.name}
        homeHref={homeHref}
        className={className}
      />
    )
  }

  return (
    <Header
      navigationData={navigation}
      logoUrl={store.theme?.logoUrl}
      homeHref={homeHref}
      className={className}
    />
  )
}
