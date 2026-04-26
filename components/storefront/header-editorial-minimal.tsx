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

type HeaderEditorialMinimalProps = {
  navigationData: NavigationSection[]
  logoUrl?: string
  storeName?: string
  className?: string
  homeHref?: string
}

export function HeaderEditorialMinimal({
  navigationData,
  logoUrl,
  storeName,
  className,
  homeHref = "/",
}: HeaderEditorialMinimalProps) {
  const cartHref = `${homeHref === "/" ? "" : homeHref}/cart`
  const wordmark = storeName
    ? storeName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 4)
        .toUpperCase()
    : "APEX"

  return (
    <header className={cn("sticky top-0 z-50 border-b border-zinc-200 bg-white/96 backdrop-blur-md", className)}>
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex flex-1 items-center gap-3">
          <div className="md:hidden">
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

          <button
            type="button"
            className="hidden items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950 md:inline-flex"
          >
            <Search className="size-4" />
            Search
          </button>
        </div>

        <div className="flex min-w-0 flex-1 justify-center">
          <Link href={homeHref} className="inline-flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Store logo" className="h-8 w-auto" />
            ) : (
              <div className="text-[1.65rem] font-semibold tracking-[-0.1em] text-zinc-950">{wordmark}</div>
            )}
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4 sm:gap-6">
          <button
            type="button"
            className="hidden text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950 md:inline-flex"
          >
            Account
          </button>
          <Link
            href={cartHref}
            className="inline-flex items-center gap-2 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors hover:text-zinc-950"
          >
            Cart
            <ShoppingBag className="size-4" />
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-zinc-200 md:block">
        <nav className="mx-auto flex h-12 max-w-[90rem] items-center justify-center gap-8 px-4 sm:px-6 lg:px-10">
          {navigationData.map((item) => (
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
    </header>
  )
}
