"use client"

import Header from "@/components/shadcn-studio/blocks/hero-section-01/header"
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { HeaderCeo } from "@/components/storefront/header-ceo"
import { HeaderEditorialMinimal } from "@/components/storefront/header-editorial-minimal"
import { HeaderPerformance } from "@/components/storefront/header-performance"
import { useCart } from "@/hooks/use-cart"
import type { StorefrontConfig } from "@/lib/types"

type StorefrontHeaderProps = {
  store: StorefrontConfig
  navigation: NavigationSection[]
  className?: string
  onOpenSearch?: () => void
}

export function StorefrontHeader({
  store,
  navigation,
  className,
  onOpenSearch,
}: StorefrontHeaderProps) {
  const homeHref = "/"
  const { lines } = useCart(store.id)
  const cartItemCount = Object.values(lines).reduce((sum, line) => sum + line.quantity, 0)

  if (store.variants.header === "header-04") {
    return (
      <HeaderCeo
        navigationData={navigation}
        logoUrl={store.theme?.logoUrl}
        storeName={store.name}
        homeHref={homeHref}
        className={className}
        onOpenSearch={onOpenSearch}
        cartItemCount={cartItemCount}
      />
    )
  }

  if (store.variants.header === "header-03") {
    return (
      <HeaderEditorialMinimal
        navigationData={navigation}
        logoUrl={store.theme?.logoUrl}
        storeName={store.name}
        homeHref={homeHref}
        className={className}
        onOpenSearch={onOpenSearch}
        cartItemCount={cartItemCount}
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
        onOpenSearch={onOpenSearch}
        cartItemCount={cartItemCount}
      />
    )
  }

  return (
    <Header
      navigationData={navigation}
      logoUrl={store.theme?.logoUrl}
      storeName={store.name}
      homeHref={homeHref}
      className={className}
      onOpenSearch={onOpenSearch}
      cartItemCount={cartItemCount}
    />
  )
}