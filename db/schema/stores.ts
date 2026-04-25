import { pgTable, uuid, varchar, text, timestamp, jsonb, real } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  heroBadge: varchar('hero_badge', { length: 255 }),
  heroTitle: varchar('hero_title', { length: 255 }),
  heroDescription: text('hero_description'),
  heroImage: varchar('hero_image', { length: 1024 }),
  navigation: jsonb('navigation'),
  variants: jsonb('variants'),
  logoUrl: varchar('logo_url', { length: 1024 }),
  primaryColor: varchar('primary_color', { length: 100 }),
  accentColor: varchar('accent_color', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const storeCategories = pgTable('store_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  count: varchar('count', { length: 255 }),
  image: varchar('image', { length: 1024 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const storeProducts = pgTable('store_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  price: real('price').notNull(),
  salePrice: real('sale_price'),
  image: varchar('image', { length: 1024 }),
  imgAlt: varchar('img_alt', { length: 255 }),
  badges: jsonb('badges'), // string[]
  category: varchar('category', { length: 255 }),
  description: text('description'),
  images: jsonb('images'), // string[]
  sizes: jsonb('sizes'), // string[]
  currency: varchar('currency', { length: 10 }).default('$'),
  stockMessage: varchar('stock_message', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  storeId: uuid('store_id').references(() => stores.id, { onDelete: 'cascade' }).notNull(),
  orderNumber: varchar('order_number', { length: 100 }).notNull().unique(),
  status: varchar('status', { length: 50 }).default('pending').notNull(),
  total: real('total').notNull(),
  customerEmail: varchar('customer_email', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => storeProducts.id, { onDelete: 'set null' }),
  productName: varchar('product_name', { length: 255 }).notNull(),
  quantity: real('quantity').notNull(), // using real or integer, let's use real just in case, but integer is standard. Next time use integer.
  price: real('price').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Type inference helpers
export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreCategory = typeof storeCategories.$inferSelect;
export type NewStoreCategory = typeof storeCategories.$inferInsert;

export type StoreProduct = typeof storeProducts.$inferSelect;
export type NewStoreProduct = typeof storeProducts.$inferInsert;
