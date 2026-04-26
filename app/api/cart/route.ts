import { NextRequest, NextResponse } from "next/server"
import { addLineToCart, getCartSnapshot, getOrCreateCart, setCartLineQuantity } from "@/lib/server/cart"

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeSlug = searchParams.get("store")
    const sessionToken = searchParams.get("sessionToken")

    if (!storeSlug || !sessionToken) {
      return badRequest("Missing required query params: store, sessionToken")
    }

    await getOrCreateCart(storeSlug, sessionToken)
    const snapshot = await getCartSnapshot(sessionToken)

    return NextResponse.json({ cart: snapshot })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load cart." },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeSlug = String(body.storeSlug ?? "")
    const sessionToken = String(body.sessionToken ?? "")
    const productSlug = String(body.productSlug ?? "")
    const quantity = Number(body.quantity ?? 1)
    const variantId = body.variantId ? String(body.variantId) : undefined
    const variantTitle = body.variantTitle ? String(body.variantTitle) : undefined

    if (!storeSlug || !sessionToken || !productSlug) {
      return badRequest("storeSlug, sessionToken, and productSlug are required.")
    }

    const cart = await addLineToCart({
      storeSlug,
      sessionToken,
      productSlug,
      quantity,
      variantId,
      variantTitle,
    })

    return NextResponse.json({ cart })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to add item to cart." },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const sessionToken = String(body.sessionToken ?? "")
    const variantId = String(body.variantId ?? "")
    const quantity = Number(body.quantity ?? 0)

    if (!sessionToken || !variantId) {
      return badRequest("sessionToken and variantId are required.")
    }

    const cart = await setCartLineQuantity({
      sessionToken,
      variantId,
      quantity,
    })

    return NextResponse.json({ cart })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update cart item." },
      { status: 500 },
    )
  }
}

