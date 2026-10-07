"use client"

import { ArrowRight, Timer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

import type { StoreBanner } from "@/lib/types"

const defaultBanner = {
  message: "Get 20% off your first order with code WELCOME20",
  link: "/shop",
  linkText: "Shop Now",
}

const defaultPromoThree = {
  headline: "Flash Sale Ends Today",
  note: "Free shipping on all orders over $50",
}

type BannerProps = {
  banner?: StoreBanner
}

export function PromoBannerOne({ banner }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const message = banner?.message || defaultBanner.message
  const link = banner?.link || defaultBanner.link
  const linkText = banner?.linkText || defaultBanner.linkText

  return (
    <div className="relative flex items-center justify-center border-b border-zinc-200 bg-zinc-950 px-4 py-3">
      <div className="flex items-center justify-center gap-3 text-sm font-medium text-white">
        <span data-edit-field="banner.message">{message}</span>
        {link ? (
          <a href={link} data-edit-field="banner.linkText" className="underline underline-offset-4 hover:no-underline">
            {linkText}
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

export function PromoBannerThree({ banner }: BannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const headline = banner?.headline || defaultPromoThree.headline
  const note = banner?.note || defaultPromoThree.note
  const link = banner?.link || defaultBanner.link
  const linkText = banner?.linkText || defaultBanner.linkText

  return (
    <div className="relative flex items-center justify-center border-b border-zinc-200 bg-zinc-950 px-4 py-3">
      <div className="flex flex-col items-center justify-center gap-2 text-center text-white sm:flex-row sm:gap-4">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4" />
          <span data-edit-field="banner.headline" className="text-sm font-semibold">
            {headline}
          </span>
        </div>
        <span data-edit-field="banner.note" className="text-sm text-zinc-300">
          {note}
        </span>
        {link ? (
          <a
            href={link}
            data-edit-field="banner.linkText"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4 hover:no-underline"
          >
            {linkText}
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
