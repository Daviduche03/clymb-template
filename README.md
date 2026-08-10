# Clymb Storefront

Multi-store storefront system built with Next.js 16, shadcn/ui v4, and Tailwind CSS v4.

All data is served by the **Clymb backend API** — no local database.

## Quick Start

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Environment Variables

Injected automatically by the Clymb orchestrator into `/workspace/.env.local`:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_STORE_ID` | Which store/brand to display |
| `NEXT_PUBLIC_API_URL` | Clymb backend API base URL |

## Storefront Layout

```
/                              ← Storefront home (hero, categories, products)
/cart                          ← Cart page
/checkout                      ← Checkout page
/products/[slug]               ← Product detail page
/orders/[orderId]              ← Order confirmation
```

The storefront renders the store selected by `NEXT_PUBLIC_STORE_ID` and fetches data through `/api/store/[...path]` which proxies to the Clymb backend API (server-side, no CORS issues).

## Storefront Architecture

- **`lib/api/store-client.ts`** — Client that fetches store config, products, cart, and orders from the API
- **`lib/types.ts`** — TypeScript types for StorefrontConfig, variants, sections, products
- **`components/storefront/`** — Storefront page shell, section rendering, headers, hero, commerce components (carts, PDP, promo banners, orders)
- **`components/shadcn-studio/blocks/`** — Pre-built section blocks (heroes, product lists, footers)

## Section Registry

Homepages are composed from a `sections` array. Each section type maps to a renderer:

| Section Type | Description |
|-------------|-------------|
| `categories` | Category grid/cards/list |
| `featured-products` | Featured product block |
| `merchandising` | Tabbed new/best/sale view |
| `collection-grid` | Full product collection with search/filter |

## Variants

Visual variants control how each section renders — header style, hero variant, product card style, cart behavior, footer, etc. These are served by the API per store.
