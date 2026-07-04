export type ShoppingCartLine = {
  id: string
  name: string
  category: string
  image: string
  price: number
  quantity: number
  productId?: string
  variantId?: string
  variantTitle?: string
  cartItemId?: string
  sku?: string
  currency?: string
}

export type ShoppingCartLineProps = {
  line?: ShoppingCartLine
  onQuantityChange?: (quantity: number) => void
  onRemove?: () => void
  className?: string
}

export const demoCartItem = {
  id: "demo",
  name: "Apple AirPods Pro (2nd gen)",
  category: "Headphones",
  variantTitle: "White",
  image:
    "https://images.unsplash.com/photo-1624258919367-5dc28f5dc293?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1160",
  price: 129,
  quantity: 1,
}
