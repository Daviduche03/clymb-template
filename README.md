# Clymb Storefront

Multi-store storefront prototype built with Next.js, shadcn/ui, Drizzle, and PostgreSQL.

## What It Does

- Renders a default storefront at `/`
- Supports store-specific storefronts at `/stores/[store]`
- Includes product detail, cart, checkout, and order confirmation flows
- Uses a unified store service that prefers DB-backed data and falls back to seeded demo storefronts when the database is unavailable
- Persists cart and wishlist state per store in local storage

## Architecture Notes

- Runtime store reads live in [lib/api/stores.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/api/stores.ts)
- Demo storefront definitions live in [lib/storefront-data.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/storefront-data.ts) and act as seed/fallback data
- Order submission is server-side in [lib/actions/orders.ts](/Users/apple/Documents/code/javascript/clymb-template/lib/actions/orders.ts), where totals are recomputed from canonical product pricing
- Database schema lives under [db/schema](/Users/apple/Documents/code/javascript/clymb-template/db/schema)

## Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:seed
```

## Next Priorities

- Add a real inventory/variant model and corresponding migration
- Move more storefront content into editable store-managed data
- Replace legacy `<img>` usage with optimized `next/image` where appropriate
- Add integration tests for cart, checkout, and order creation
