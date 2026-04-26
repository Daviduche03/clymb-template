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

type HeaderPerformanceProps = {
  navigationData: NavigationSection[]
  logoUrl?: string
  storeName?: string
  className?: string
  homeHref?: string
}

export function HeaderPerformance({
  navigationData,
  logoUrl,
  storeName,
  className,
  homeHref = "/",
}: HeaderPerformanceProps) {
  const cartHref = `${homeHref === "/" ? "" : homeHref}/cart`
  const wordmark = storeName ? storeName.replace(/\s+/g, " ").trim().toUpperCase() : "APEX."

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden flex-1 items-center md:flex">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] text-zinc-600 transition-colors hover:text-zinc-950"
          >
            <Search className="size-4" />
            Search
          </button>
        </div>

        <div className="flex flex-1 justify-start md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              {navigationData.map((item, index) => (
                <DropdownMenuItem key={index}>
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex justify-center">
          <Link href={homeHref} className="inline-flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Store logo" className="h-8 w-auto" />
            ) : (
              <div className="text-[1.8rem] font-semibold tracking-[-0.08em] text-zinc-950">{wordmark}</div>
            )}
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-5 md:flex">
          <button type="button" className="text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-950">
            Account
          </button>
          <Link href={cartHref} className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-950">
            Cart
            <ShoppingBag className="size-4" />
          </Link>
        </div>
      </div>

      <div className="hidden border-t md:block">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-8 px-4 sm:px-6 lg:px-8">
          {navigationData.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
