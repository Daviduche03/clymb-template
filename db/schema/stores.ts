import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const stores = pgTable("stores", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  heroBadge: varchar("hero_badge", { length: 255 }),
  heroTitle: varchar("hero_title", { length: 255 }),
  heroDescription: text("hero_description"),
  heroImage: varchar("hero_image", { length: 1024 }),
  navigation: jsonb("navigation"),
  variants: jsonb("variants"),
  logoUrl: varchar("logo_url", { length: 1024 }),
  primaryColor: varchar("primary_color", { length: 100 }),
  accentColor: varchar("accent_color", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const storeCategories = pgTable(
  "store_categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    count: varchar("count", { length: 255 }),
    image: varchar("image", { length: 1024 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    storeIdx: index("store_categories_store_idx").on(table.storeId),
  }),
)

export const storeProducts = pgTable(
  "store_products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    price: real("price").notNull(),
    salePrice: real("sale_price"),
    image: varchar("image", { length: 1024 }),
    imgAlt: varchar("img_alt", { length: 255 }),
    badges: jsonb("badges"),
    category: varchar("category", { length: 255 }),
    description: text("description"),
    images: jsonb("images"),
    sizes: jsonb("sizes"),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    stockMessage: varchar("stock_message", { length: 255 }),
    inventory: integer("inventory").default(0).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    storeSlugUnique: uniqueIndex("store_products_store_slug_unique").on(table.storeId, table.slug),
    storeIdx: index("store_products_store_idx").on(table.storeId),
  }),
)

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").references(() => storeProducts.id, { onDelete: "cascade" }).notNull(),
    sku: varchar("sku", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).default("Default").notNull(),
    optionValues: jsonb("option_values"),
    price: real("price").notNull(),
    compareAtPrice: real("compare_at_price"),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    inventory: integer("inventory").default(0).notNull(),
    reserved: integer("reserved").default(0).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    skuUnique: uniqueIndex("product_variants_sku_unique").on(table.sku),
    productIdx: index("product_variants_product_idx").on(table.productId),
  }),
)

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id"),
    sessionToken: varchar("session_token", { length: 255 }).notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sessionTokenUnique: uniqueIndex("carts_session_token_unique").on(table.sessionToken),
    storeStatusIdx: index("carts_store_status_idx").on(table.storeId, table.status),
  }),
)

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").references(() => carts.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => storeProducts.id, { onDelete: "cascade" }).notNull(),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    unitPriceSnapshot: real("unit_price_snapshot").notNull(),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    cartVariantUnique: uniqueIndex("cart_items_cart_variant_unique").on(table.cartId, table.variantId),
    cartIdx: index("cart_items_cart_idx").on(table.cartId),
  }),
)

export const inventoryReservations = pgTable(
  "inventory_reservations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
    cartId: uuid("cart_id").references(() => carts.id, { onDelete: "cascade" }),
    orderId: uuid("order_id"),
    sessionToken: varchar("session_token", { length: 255 }),
    quantity: integer("quantity").notNull(),
    status: varchar("status", { length: 50 }).default("active").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    variantStatusIdx: index("inventory_reservations_variant_status_idx").on(table.variantId, table.status),
  }),
)

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "cascade" }).notNull(),
    cartId: uuid("cart_id").references(() => carts.id, { onDelete: "set null" }),
    orderNumber: varchar("order_number", { length: 100 }).notNull().unique(),
    status: varchar("status", { length: 50 }).default("pending").notNull(),
    paymentStatus: varchar("payment_status", { length: 50 }).default("pending").notNull(),
    subtotal: real("subtotal").notNull(),
    total: real("total").notNull(),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    shippingAddress: text("shipping_address"),
    idempotencyKey: varchar("idempotency_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    idempotencyUnique: uniqueIndex("orders_store_idempotency_unique").on(table.storeId, table.idempotencyKey),
    storeIdx: index("orders_store_idx").on(table.storeId),
  }),
)

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
    productId: uuid("product_id").references(() => storeProducts.id, { onDelete: "set null" }),
    variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    variantTitle: varchar("variant_title", { length: 255 }),
    variantSku: varchar("variant_sku", { length: 255 }),
    quantity: integer("quantity").notNull(),
    price: real("price").notNull(),
    currency: varchar("currency", { length: 10 }).default("$").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("order_items_order_idx").on(table.orderId),
  }),
)

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export type StoreCategory = typeof storeCategories.$inferSelect
export type NewStoreCategory = typeof storeCategories.$inferInsert

export type StoreProduct = typeof storeProducts.$inferSelect
export type NewStoreProduct = typeof storeProducts.$inferInsert

export type ProductVariant = typeof productVariants.$inferSelect
export type NewProductVariant = typeof productVariants.$inferInsert

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export type CartItem = typeof cartItems.$inferSelect
export type NewCartItem = typeof cartItems.$inferInsert

export type InventoryReservation = typeof inventoryReservations.$inferSelect
export type NewInventoryReservation = typeof inventoryReservations.$inferInsert

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

export type OrderItem = typeof orderItems.$inferSelect
export type NewOrderItem = typeof orderItems.$inferInsert
