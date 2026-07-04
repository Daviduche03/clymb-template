"use client"

import type { ShoppingCartLineProps } from "@/components/commercn/carts/cart-types"
import type { StorefrontVariants } from "@/lib/types"
import { ShoppingCartOne } from "@/components/commercn/carts/cart-01"
import { ShoppingCartTwo } from "@/components/commercn/carts/cart-02"
import { ShoppingCartThree } from "@/components/commercn/carts/cart-03"

type CartLineProps = ShoppingCartLineProps & {
  variant?: StorefrontVariants["cartStyle"]
}

export function CartLine({ variant = "cart-01", ...props }: CartLineProps) {
  switch (variant) {
    case "cart-02":
      return <ShoppingCartTwo {...props} />
    case "cart-03":
      return <ShoppingCartThree {...props} />
    default:
      return <ShoppingCartOne {...props} />
  }
}
