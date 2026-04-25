"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const legacy = {
  name: "Man Black Cotton T-Shirt",
  description:
    "A comfortable and durable cotton t-shirt for men. Gives you a perfect fit and a great look for every occasion.",
  category: "Clothing",
  currency: "$",
  originalPrice: 25.4,
  discount: 6,
  images: [
    "https://images.unsplash.com/photo-1502389614483-e475fc34407e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
    "https://images.unsplash.com/photo-1618453292459-53424b66bb6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
    "https://images.unsplash.com/photo-1618453292507-4959ece6429e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928",
    "https://images.unsplash.com/photo-1617984102437-a4aa52284d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774",
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  stockMessage: "Last 1 left - make it yours!",
}

export type ProductDetailModel = {
  name: string
  description: string
  category: string
  images: string[]
  sizes: string[]
  currency: string
  currentPrice: number
  compareAtPrice?: number
  stockMessage?: string
  highlights?: string[]
  details?: { label: string; value: string }[]
  shippingNote?: string
}

const defaultModel: ProductDetailModel = {
  name: legacy.name,
  description: legacy.description,
  category: legacy.category,
  images: legacy.images,
  sizes: legacy.sizes,
  currency: legacy.currency,
  currentPrice: legacy.originalPrice - legacy.discount,
  compareAtPrice: legacy.originalPrice,
  stockMessage: legacy.stockMessage,
  highlights: ["Premium weight fabric", "Relaxed performance fit", "Minimal exterior branding"],
  details: [
    { label: "Material", value: "Heavyweight cotton blend" },
    { label: "Fit", value: "Relaxed silhouette" },
    { label: "Use", value: "Daily wear / training commute" },
  ],
  shippingNote: "Free delivery on orders over $120. Easy 30-day returns.",
}

export type ProductDetailOneProps = {
  product?: ProductDetailModel | null
  onAddToCart?: (quantity: number) => void
  className?: string
}

export function ProductDetailOne({ product, onAddToCart, className }: ProductDetailOneProps) {
  const model = product ?? defaultModel

  return <ProductDetailContent key={model.name} model={model} onAddToCart={onAddToCart} className={className} />
}

function ProductDetailContent({
  model,
  onAddToCart,
  className,
}: {
  model: ProductDetailModel
  onAddToCart?: (quantity: number) => void
  className?: string
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(model.sizes[0] ?? "S")
  const [quantity, setQuantity] = useState(1)

  const images = model.images
  const len = Math.max(images.length, 1)

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % len)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + len) % len)
  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  return (
    <div className={cn("not-prose mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8", className)}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="grid gap-4 lg:grid-cols-[108px_minmax(0,1fr)]">
          <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "aspect-square w-20 shrink-0 overflow-hidden border bg-zinc-100 transition-all lg:w-auto",
                  currentImageIndex === index
                    ? "border-zinc-950"
                    : "border-zinc-200 opacity-70 hover:opacity-100",
                )}
              >
                <img src={image} alt={`${model.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="relative order-1 aspect-[0.78] overflow-hidden bg-[var(--store-panel)] lg:order-2">
            <div className="absolute left-4 top-4 z-10 bg-white/95 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Core collection
            </div>
            <img src={images[currentImageIndex]} alt={model.name} className="h-full w-full object-cover object-center" />

            {len > 1 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-zinc-200 bg-white/90 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border-zinc-200 bg-white/90 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : null}
          </div>
        </div>

        <div className="space-y-8 lg:pt-4">
          <div className="border-b border-zinc-200 pb-6">
            <p className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">{model.category}</p>
            <h1 className="text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-5xl">
              {model.name}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">{model.description}</p>
          </div>

          <div className="space-y-6 border-b border-zinc-200 pb-8">
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
                {model.currency}
                {model.currentPrice.toFixed(2)}
              </p>
              {model.compareAtPrice != null ? (
                <p className="text-lg font-medium text-zinc-400 line-through">
                  {model.currency}
                  {model.compareAtPrice.toFixed(2)}
                </p>
              ) : null}
            </div>

            {model.stockMessage ? (
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {model.stockMessage}
              </p>
            ) : null}

            <div>
              <h3 className="mb-3 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Size</h3>
              <div className="flex flex-wrap gap-2">
                {model.sizes.map((size) => (
                  <Button
                    key={size}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-11 rounded-none border px-5 text-xs font-medium uppercase tracking-[0.16em]",
                      selectedSize === size
                        ? "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-900"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50",
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center border border-zinc-300">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-zinc-50"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-14 text-center text-sm font-medium text-zinc-950">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 rounded-none hover:bg-zinc-50"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-none px-8 text-xs uppercase tracking-[0.24em]"
                onClick={() => onAddToCart?.(quantity)}
              >
                Add to cart
              </Button>
            </div>
          </div>

          <div className="grid gap-8 border-b border-zinc-200 pb-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Why it works</h3>
              <ul className="space-y-3">
                {(model.highlights ?? []).map((item) => (
                  <li key={item} className="border-b border-zinc-100 pb-3 text-sm leading-6 text-zinc-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Details</h3>
              <div className="space-y-3">
                {(model.details ?? []).map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3">
                    <span className="text-sm text-zinc-500">{item.label}</span>
                    <span className="text-right text-sm font-medium text-zinc-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-zinc-200 bg-white p-4">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Delivery</p>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                {model.shippingNote ?? "Dispatches in 1-2 business days."}
              </p>
            </div>
            <div className="border border-zinc-200 bg-white p-4">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Returns</p>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                Easy 30-day returns on unworn items with original tags.
              </p>
            </div>
            <div className="border border-zinc-200 bg-white p-4">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500">Styling note</p>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                Designed to work as a clean standalone piece or layered into a neutral performance wardrobe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
