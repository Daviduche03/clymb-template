import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import * as schema from './schema/index';
import { storefronts } from '../lib/storefront-data';

// Per-store theme overrides for seeding
const storeThemes: Record<string, { logoUrl?: string; primaryColor?: string; accentColor?: string }> = {
  'galaxy-watch': {
    primaryColor: '0.488 0.243 264.376', // indigo-blue
    accentColor: '0.488 0.243 264.376',
  },
  'fitness-wear': {
    primaryColor: '0.596 0.145 163.225', // teal-green
    accentColor: '0.596 0.145 163.225',
  },
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

async function main() {
  console.log('Seeding database...');

  try {
    for (const store of storefronts) {
      console.log(`Seeding store: ${store.name}`);
      
      // Check if store exists to avoid duplicates
      const existingStore = await db.query.stores.findFirst({
        where: (stores, { eq }) => eq(stores.slug, store.id)
      });

      let storeId: string;

      if (!existingStore) {
        const theme = storeThemes[store.id] || {};
        const [newStore] = await db.insert(schema.stores).values({
          slug: store.id,
          name: store.name,
          heroBadge: store.heroBadge,
          heroTitle: store.heroTitle,
          heroDescription: store.heroDescription,
          heroImage: store.heroImage,
          navigation: store.navigation,
          variants: store.variants,
          logoUrl: theme.logoUrl || null,
          primaryColor: theme.primaryColor || null,
          accentColor: theme.accentColor || null,
        }).returning({ id: schema.stores.id });
        storeId = newStore.id;
        console.log(`Created store: ${store.name}`);
      } else {
        storeId = existingStore.id;
        const theme = storeThemes[store.id] || {};
        // Update existing config
        await db.update(schema.stores).set({
          name: store.name,
          heroBadge: store.heroBadge,
          heroTitle: store.heroTitle,
          heroDescription: store.heroDescription,
          heroImage: store.heroImage,
          navigation: store.navigation,
          variants: store.variants,
          logoUrl: theme.logoUrl || null,
          primaryColor: theme.primaryColor || null,
          accentColor: theme.accentColor || null,
        }).where(eq(schema.stores.slug, store.id));
        console.log(`Updated store: ${store.name}`);
      }

      // Sync categories
      if (store.categories && store.categories.length > 0) {
        await db.delete(schema.storeCategories).where(eq(schema.storeCategories.storeId, storeId));
        await db.insert(schema.storeCategories).values(
          store.categories.map((c) => ({
            storeId,
            title: c.title,
            count: c.count,
            image: c.image,
          }))
        );
        console.log(`Seeded categories for ${store.name}`);
      }

      // Sync products
      if (store.products && store.products.length > 0) {
        await db.delete(schema.storeProducts).where(eq(schema.storeProducts.storeId, storeId));
        const insertedProducts = await db.insert(schema.storeProducts).values(
          store.products.map((p) => {
            const currentPrice = p.detail?.currentPrice ?? p.salePrice ?? p.price;
            const originalPrice = p.detail?.compareAtPrice ?? p.price;
            
            return {
              storeId,
              slug: p.slug,
              name: p.name,
              price: originalPrice,
              salePrice: currentPrice,
              image: p.detail?.images?.[0] ?? p.image,
              imgAlt: p.imgAlt,
              badges: p.badges,
              category: p.detail?.category ?? (p.badges.join(" · ") || "Wearables"),
              description: p.detail?.description ?? `Includes ${p.badges.join(" · ")}. Built for all-day comfort.`,
              images: p.detail?.images ?? [p.image],
              sizes: p.detail?.sizes ?? [],
              currency: p.detail?.currency ?? "$",
              stockMessage: p.detail?.stockMessage,
              inventory: p.inventory ?? 0,
              active: true,
            };
          })
        ).returning({
          id: schema.storeProducts.id,
          slug: schema.storeProducts.slug,
          currency: schema.storeProducts.currency,
        });

        await db.insert(schema.productVariants).values(
          insertedProducts.map((product) => {
            const sourceProduct = store.products.find((entry) => entry.slug === product.slug);
            const unitPrice =
              sourceProduct?.detail?.currentPrice ??
              sourceProduct?.salePrice ??
              sourceProduct?.price ??
              0;
            const compareAtPrice =
              sourceProduct?.detail?.compareAtPrice ??
              (sourceProduct?.salePrice != null ? sourceProduct.price : undefined);
            const optionValues = sourceProduct?.detail?.sizes?.length
              ? { size: sourceProduct.detail.sizes[0] }
              : { title: "Default" };

            return {
              productId: product.id,
              sku: `${store.id}-${product.slug}-default`,
              title: sourceProduct?.detail?.sizes?.[0] ?? "Default",
              optionValues,
              price: unitPrice,
              compareAtPrice,
              currency: product.currency ?? "$",
              inventory: sourceProduct?.inventory ?? 0,
              reserved: 0,
              active: true,
            };
          }),
        );
        console.log(`Seeded products for ${store.name}`);
      }
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
