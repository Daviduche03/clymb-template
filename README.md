# Clymb Storefront

Multi-store storefront system built with Next.js, shadcn/ui, Drizzle, and PostgreSQL.

This repo now supports:
- a default storefront at `/`
- store-specific storefronts at `/stores/[store]`
- configurable homepage composition through a section registry
- configurable visual variants for hero, categories, product cards, search, PDP, cart, and footer
- DB-backed stores with in-code fallback storefront definitions

## Quick Start

```bash
pnpm install
pnpm dev
```

Database scripts:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
```

Quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Where To Configure A Store

The main storefront definitions live in [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts).

That file defines:
- store metadata
- navigation
- categories
- products
- variant flags
- homepage sections

Runtime store reads are handled by [lib/api/stores.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/api/stores.ts).

Behavior today:
- if the DB is available and a matching store exists, runtime data comes from the DB
- if not, the app falls back to the in-code storefront definitions
- DB-backed stores currently inherit `sections` from the matching in-code storefront by slug

## Store Config Shape

Use this shape when adding or editing storefronts:

```ts
type StorefrontConfig = {
  id: string
  name: string
  heroBadge: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  navigation: NavigationSection[]
  categories: StoreCategory[]
  products: StoreProduct[]
  variants: StorefrontVariants
  sections?: StorefrontSection[]
  theme?: {
    logoUrl?: string
    primaryColor?: string
    accentColor?: string
  }
}
```

## Minimal Example

```ts
export const exampleStore: StorefrontConfig = {
  id: "example-store",
  name: "Example Store",
  heroBadge: "New Collection",
  heroTitle: "Premium essentials built to move.",
  heroDescription: "A configurable storefront using composable homepage sections.",
  heroImage: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1400&auto=format&fit=crop",
  navigation: [
    { title: "Home", href: "/" },
    { title: "Shop", href: "#collection" },
    { title: "Categories", href: "#categories" },
    { title: "Cart", href: "/cart" },
  ],
  categories: [
    { id: "new", title: "New Arrivals", count: "Latest drop", image: "https://..." },
    { id: "tops", title: "Tops", count: "Premium layers", image: "https://..." },
  ],
  products: [
    {
      slug: "core-tee",
      name: "Core Tee",
      image: "https://...",
      imgAlt: "Core Tee",
      price: 55,
      badges: ["New", "Essentials"],
    },
  ],
  variants: {
    banner: "none",
    hero: "hero-editorial",
    categories: "split",
    productCards: "product-card-04",
    productDetails: "route",
    cart: "route",
    search: "minimal",
    productPage: "editorial",
    cartStyle: "minimal",
    footer: "footer-03",
  },
  sections: [
    { type: "categories", title: "Curated edits" },
    { type: "featured-products", title: "Featured essentials", limit: 4 },
    { type: "collection-grid", title: "Shop the full collection", badge: "Example Store", perPage: 8 },
  ],
}
```

## Variant Reference

### `banner`

Controls the promo banner rendered above the header in [components/storefront/storefront-page.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-page.tsx).

Options:
- `"none"`: no banner
- `"promo-01"`: [components/commercn/promo-banners/promo-banner-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/promo-banners/promo-banner-01.tsx)
- `"promo-03"`: [components/commercn/promo-banners/promo-banner-03.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/promo-banners/promo-banner-03.tsx)

### `hero`

Controls the top hero section.

Options:
- `"custom"`: fallback inline hero in [components/storefront/storefront-page.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-page.tsx)
- `"hero-section-01"`: [components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/shadcn-studio/blocks/hero-section-01/hero-section-01.tsx)
- `"hero-section-41"`: [components/shadcn-studio/blocks/hero-section-41/hero-section-41.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/shadcn-studio/blocks/hero-section-41/hero-section-41.tsx)
- `"hero-editorial"`: [components/storefront/hero-section-editorial.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/hero-section-editorial.tsx)

### `categories`

Controls the category section layout inside the homepage section renderer in [components/storefront/storefront-experience.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-experience.tsx).

Options:
- `"cards"`: image cards using [components/commercn/categories/category-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/categories/category-01.tsx)
- `"list"`: compact list cards using [components/commercn/categories/category-02.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/categories/category-02.tsx)
- `"circle"`: circular story-style layout using [components/commercn/categories/category-04.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/categories/category-04.tsx)
- `"split"`: featured-plus-secondary editorial layout using [components/storefront/category-section-split.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/category-section-split.tsx)

### `productCards`

Controls the featured product card style.

Options:
- `"none"`: reserved for future use
- `"product-card-01"`: [components/commercn/product-cards/product-card-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/product-cards/product-card-01.tsx)
- `"product-card-02"`: [components/commercn/product-cards/product-card-02.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/product-cards/product-card-02.tsx)
- `"product-card-03"`: [components/commercn/product-cards/product-card-03.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/product-cards/product-card-03.tsx)
- `"product-card-04"`: [components/commercn/product-cards/product-card-04.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/product-cards/product-card-04.tsx)
- `"both"`: falls back to the default list/grid display path where supported

### `productDetails`

Controls how product detail is opened from the storefront.

Options:
- `"dialog"`: detail opens in a modal dialog
- `"route"`: detail opens on a dedicated product page
- `"both"`: supports both dialog and full-page path

### `cart`

Controls how cart access works.

Options:
- `"dialog"`: cart modal only
- `"route"`: cart page only
- `"both"`: modal and cart page

### `search`

Controls collection search/filter styling.

Options:
- `"panel"`: boxed search/filter panel
- `"minimal"`: flatter, reduced-chrome search bar

### `productPage`

Controls the product detail page presentation.

Options:
- `"editorial"`: premium editorial PDP presentation
- `"split"`: reserved for an alternate PDP style path

### `cartStyle`

Controls cart modal/cart summary layout style.

Options:
- `"standard"`: single-column dialog/cart presentation
- `"minimal"`: more spacious, grid-oriented cart presentation

### `footer`

Controls the footer variant.

Options:
- `"footer-01"`: [components/shadcn-studio/blocks/footer-component-01/footer-component-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/shadcn-studio/blocks/footer-component-01/footer-component-01.tsx)
- `"footer-02"`: [components/shadcn-studio/blocks/footer-component-01/footer-component-02.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/shadcn-studio/blocks/footer-component-01/footer-component-02.tsx)
- `"footer-03"`: [components/shadcn-studio/blocks/footer-component-01/footer-component-03.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/shadcn-studio/blocks/footer-component-01/footer-component-03.tsx)

## Homepage Section Registry

Homepage composition is now driven by `sections`.

Section types are defined in [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts) and rendered through the registry in [components/storefront/storefront-experience.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-experience.tsx).

Current section types:

### `categories`

Renders the category section using the currently selected `variants.categories`.

Config:

```ts
{ type: "categories", title?: string, description?: string }
```

### `featured-products`

Renders the top featured product block using the currently selected `variants.productCards`.

Config:

```ts
{ type: "featured-products", title?: string, description?: string, limit?: number }
```

### `merchandising`

Renders the tabbed merchandising view for `new / best / sale`.

Config:

```ts
{ type: "merchandising", title?: string, description?: string }
```

### `collection-grid`

Renders the searchable/filterable full product collection grid and pagination.

Config:

```ts
{ type: "collection-grid", title?: string, badge?: string, perPage?: number }
```

## How To Add A New Section

To add another homepage section type:

1. Create the section component under `components/storefront/` or another appropriate folder.
2. Extend `StorefrontSection` in [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts).
3. Add a renderer for the new `type` in the section registry inside [components/storefront/storefront-experience.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-experience.tsx).
4. Add the new section object to a store’s `sections` array.

Example:

```ts
type StorefrontSection =
  | { type: "story-strip"; title?: string }
```

Then register it in the renderer and use:

```ts
sections: [
  { type: "story-strip", title: "Brand story" },
]
```

## Current Demo Stores

### `galaxy-watch`

Configured for:
- banner promo
- expressive hero
- standard category cards
- product card variant 01
- dialog-enabled product details
- standard search panel
- footer variant 02

### `fitness-wear`

Configured for:
- editorial hero
- split categories
- product card variant 04
- minimal search
- route-first product pages
- minimal cart styling
- footer variant 03
- custom section order

## Important Files

- [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts): storefront types, demo stores, variants, sections
- [lib/api/stores.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/api/stores.ts): runtime store loading and DB fallback logic
- [components/storefront/storefront-page.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-page.tsx): page shell, hero/footer selection
- [components/storefront/storefront-experience.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/storefront/storefront-experience.tsx): homepage section registry and storefront interaction layer
- [components/commercn/product-details/product-detail-01.tsx](/Users/apple/Documents/code/javascript/clymb-template/components/commercn/product-details/product-detail-01.tsx): PDP component

## Notes

- `build` can fail in some environments if Google Fonts cannot be fetched from `next/font`.
- `lint` currently passes with warnings only; most warnings are existing `<img>` usage across legacy/demo components.
- The easiest way to create a new storefront today is to copy an existing store in [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts), adjust `variants`, then adjust `sections`.
