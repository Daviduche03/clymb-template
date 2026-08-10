"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
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

export type ProductDetailOneProps = {
  product?: ProductDetailModel | null
  onAddToCart?: (quantity: number, size?: string) => void
  className?: string
  variant?: "editorial" | "split"
}

export function ProductDetailOne({ product, onAddToCart, className, variant = "editorial" }: ProductDetailOneProps) {
  const model = product ?? legacyModel
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(model.sizes[0] ?? "S")
  const [quantity, setQuantity] = useState(1)
  const [didAdd, setDidAdd] = useState(false)

  const images = model.images
  const len = Math.max(images.length, 1)
  const selectedAvailable = model.sizeAvailability?.[selectedSize]
  const isSelectedOutOfStock = selectedAvailable != null && selectedAvailable <= 0
  const isFullyOutOfStock =
    model.sizeAvailability != null
      ? Object.values(model.sizeAvailability).every((value) => value <= 0)
      : false

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % len)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + len) % len)
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  useEffect(() => {
    if (!didAdd) return
    const timeout = window.setTimeout(() => setDidAdd(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [didAdd])

  return (
    <div className={cn("w-full max-w-6xl", className)}>
      <div className={cn("grid grid-cols-1 gap-10 lg:gap-12", variant === "split" ? "lg:grid-cols-[0.9fr_1.1fr]" : "lg:grid-cols-2")}>
        <div className="flex gap-2">
          <div className="flex w-24 flex-col gap-2 sm:w-28">
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  "aspect-square overflow-hidden border bg-zinc-100 transition-colors",
                  currentImageIndex === index ? "border-zinc-900" : "border-zinc-200",
                )}
              >
                <img
                  src={image}
                  alt={`${model.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="relative aspect-3/4 flex-1 overflow-hidden border border-zinc-200 bg-zinc-100">
            <img
              src={images[currentImageIndex]}
              alt={model.name}
              className="h-full w-full object-cover"
            />

            {len > 1 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.24em] text-zinc-500">{model.category}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-zinc-950">{model.name}</h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">{model.description}</p>
            {model.stockMessage ? (
              <p className="mt-3 text-sm font-medium text-zinc-500">{model.stockMessage}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <p className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950">
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
            <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Size</h3>
            <div className="flex flex-wrap gap-2">
              {model.sizes.map((size) => {
                const available = model.sizeAvailability?.[size]
                const isUnavailable = available != null && available <= 0

                return (
                  <Button
                    key={size}
                    type="button"
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    disabled={isUnavailable}
                    className={cn(
                      "rounded-none",
                      selectedSize === size
                        ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                        : "border-zinc-300 text-zinc-900 hover:bg-zinc-50",
                      isUnavailable && "opacity-40",
                    )}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-zinc-200">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-zinc-50"
                onClick={decrementQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-zinc-50"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              size="lg"
              disabled={isFullyOutOfStock || isSelectedOutOfStock}
              className="border border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
              onClick={() => {
                onAddToCart?.(quantity, selectedSize)
                if (onAddToCart) setDidAdd(true)
              }}
            >
              {isFullyOutOfStock || isSelectedOutOfStock
                ? "Out of stock"
                : didAdd
                  ? "Added to cart"
                  : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}