"use client"

import { ArrowRight, Timer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const bannerData = {
  message: "Get 20% off your first order with code WELCOME20",
  link: "/shop",
  linkText: "Shop Now",
}

export function PromoBannerOne() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative flex items-center justify-center border-b border-zinc-200 bg-zinc-950 px-4 py-3">
      <div className="flex items-center justify-center gap-3 text-sm font-medium text-white">
        <span>{bannerData.message}</span>
        {bannerData.link ? (
          <a href={bannerData.link} className="underline underline-offset-4 hover:no-underline">
            {bannerData.linkText}
          </a>
        ) : null}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 text-white hover:bg-white/10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function PromoBannerThree() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative flex items-center justify-center border-b border-zinc-200 bg-zinc-950 px-4 py-3">
      <div className="flex flex-col items-center justify-center gap-2 text-center text-white sm:flex-row sm:gap-4">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span className="text-sm font-semibold">Flash Sale Ends Today</span>
        </div>
        <span className="text-sm text-zinc-300">Free shipping on all orders over $50</span>
        {bannerData.link ? (
          <a
            href={bannerData.link}
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 hover:no-underline"
          >
            Shop Now
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 text-white hover:bg-white/10"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}