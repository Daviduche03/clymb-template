"use client"

import Link from "next/link"
import { MenuIcon, Search, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { NavigationSection } from "@/components/shadcn-studio/blocks/hero-section-01/header"
import { cn } from "@/lib/utils"

type HeaderCeoProps = {
  navigationData: NavigationSection[]
  logoUrl?: string
  storeName?: string
  className?: string
  homeHref?: string
  onOpenSearch?: () => void
  cartItemCount?: number
}

export function HeaderCeo({
  navigationData,
  logoUrl,
  storeName,
  className,
  homeHref = "/",
  onOpenSearch,
  cartItemCount,
}: HeaderCeoProps) {
  const cartHref = `${homeHref === "/" ? "" : homeHref}/cart`
  const wordmark = storeName
    ? storeName.split(" ").map((part) => part[0]).join("").slice(0, 4).toUpperCase()
    : "STORE"
  const tagline = storeName ? storeName.toUpperCase() : "CURATED GOODS"

  return (
    <header className={cn("sticky top-0 z-50 border-b border-zinc-200 bg-white", className)}>
      <div className="border-b border-zinc-200 bg-zinc-950">
        <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-between px-4 text-[0.65rem] uppercase tracking-[0.24em] text-zinc-300 sm:px-6 lg:px-10">
          <span>{tagline}</span>
          <span className="hidden sm:inline">Free shipping over $50</span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MenuIcon className="size-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                {navigationData.map((item) => (
                  <DropdownMenuItem key={item.title}>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigationData.slice(0, 3).map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex justify-center">
          <Link href={homeHref} className="inline-flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Store logo" className="h-8 w-auto" />
            ) : (
              <div className="text-[2rem] font-semibold tracking-[-0.1em] text-zinc-950">
                {wordmark}<span className="text-zinc-400">.</span>
              </div>
            )}
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 sm:gap-6">
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950 md:inline-flex"
          >
            <Search className="size-4" />
            Search
          </button>
          <Link
            href={cartHref}
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950"
          >
            Cart
            <span className="relative">
              <ShoppingBag className="size-4" />
              {cartItemCount ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[0.6rem] font-semibold text-white">
                  {cartItemCount}
                </span>
              ) : null}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}