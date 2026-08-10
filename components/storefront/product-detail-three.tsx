"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Minus, Plus, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductDetailModel } from "@/lib/types"

const legacyModel: ProductDetailModel = {
  name: "Man Black Cotton T-Shirt",
  description:
    "A comfortable and durable cotton t-shirt for men. Gives you a perfect fit and a great look for every occasion.",
  category: "Clothing",
  currency: "$",
  currentPrice: 19.4,
  compareAtPrice: 25.4,
  stockMessage: "Last 1 left - make it yours!",
  images: [
    "https://images.unsplash.com/photo-1502389614483-e475fc34407e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    "https://images.unsplash.com/photo-1618453292459-53424b66bb6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
    "https://images.unsplash.com/photo-1618453292507-4959ece6429e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
    "https://images.unsplash.com/photo-1617984102437-a4aa52284d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
}

export type ProductDetailThreeProps = {
  product?: ProductDetailModel | null
  onAddToCart?: (quantity: number, size?: string) => void
  className?: string
}

export function ProductDetailThree({ product, onAddToCart, className }: ProductDetailThreeProps) {
  const model = product ?? legacyModel
  const [active, setActive] = useState(0)
  const [selectedSize, setSelectedSize] = useState(model.sizes[0] ?? "S")
  const [quantity, setQuantity] = useState(1)
  const [didAdd, setDidAdd] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)

  const images = model.images
  const len = Math.max(images.length, 1)
  const selectedAvailable = model.sizeAvailability?.[selectedSize]
  const isSelectedOutOfStock = selectedAvailable != null && selectedAvailable <= 0
  const isFullyOutOfStock =
    model.sizeAvailability != null
      ? Object.values(model.sizeAvailability).every((value) => value <= 0)
      : false

  useEffect(() => {
    if (!didAdd) return
    const timeout = window.setTimeout(() => setDidAdd(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [didAdd])

  useEffect(() => {
    const onScroll = () => {
      const gallery = document.getElementById("pdt3-gallery")
      if (gallery) setRect(gallery.getBoundingClientRect())
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const galleryVisible = rect == null || (rect.top < window.innerHeight && rect.bottom > 0)

  return (
    <div className={cn("w-full max-w-6xl", className)}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Sticky info (left) */}
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
          <div className="space-y-6 lg:pr-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">{model.category}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{model.name}</h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{model.description}</p>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <p className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950">
                {model.currency}
                {model.currentPrice.toFixed(2)}
              </p>
              {model.compareAtPrice != null ? (
                <p className="text-xl font-medium text-zinc-400 line-through">
                  {model.currency}
                  {model.compareAtPrice.toFixed(2)}
                </p>
              ) : null}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Size</h3>
                <button type="button" className="text-xs font-medium text-zinc-500 underline underline-offset-2">
                  Size guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {model.sizes.map((size) => {
                  const available = model.sizeAvailability?.[size]
                  const isUnavailable = available != null && available <= 0

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
                        selectedSize === size
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-zinc-300 text-zinc-900 hover:border-accent",
                        isUnavailable && "cursor-not-allowed opacity-40",
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-zinc-200">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-zinc-50"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-none hover:bg-zinc-50"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="lg"
                  disabled={isFullyOutOfStock || isSelectedOutOfStock}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    onAddToCart?.(quantity, selectedSize)
                    if (onAddToCart) setDidAdd(true)
                  }}
                >
                  {isFullyOutOfStock || isSelectedOutOfStock
                    ? "Out of stock"
                    : didAdd ? (
                        <>
                          <Check className="mr-2 h-4 w-4" /> Added to cart
                        </>
                      ) : (
                        "Add to cart"
                      )}
                </Button>
              </div>
              <p className="flex items-center gap-2 text-xs text-zinc-500">
                <ShieldCheck className="h-4 w-4" />
                30-day money-back guarantee
              </p>
            </div>
          </div>
        </div>

        {/* Gallery (right) */}
        <div id="pdt3-gallery" className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
            <img src={images[active]} alt={model.name} className="h-full w-full object-cover" />
            {model.stockMessage ? (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur-sm">
                {model.stockMessage}
              </span>
            ) : null}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  "aspect-[4/5] overflow-hidden rounded-xl border bg-zinc-100 transition-all",
                  active === index ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-zinc-200 opacity-70 hover:opacity-100",
                )}
              >
                <img src={image} alt={`${model.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}