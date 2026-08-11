import Link from 'next/link'
import { MenuIcon, Search, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'
export type NavigationSection = {
  title: string
  href: string
}

type HeaderProps = {
  navigationData: NavigationSection[]
  logoUrl?: string
  storeName?: string
  className?: string
  homeHref?: string
  onOpenSearch?: () => void
  cartItemCount?: number
}

const Header = ({ navigationData, logoUrl, storeName, className, homeHref = "/", onOpenSearch, cartItemCount = 0 }: HeaderProps) => {
  const wordmark = storeName
    ? storeName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 4)
        .toUpperCase()
    : "CLYMB"

  return (
    <header className={cn('bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm', className)}>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <div className='hidden min-w-0 flex-1 items-center md:flex'>
          <button
            type='button'
            onClick={onOpenSearch}
            className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs font-medium tracking-[0.02em] transition-colors'
          >
            <Search className='size-4' />
            Search
          </button>
        </div>

        <div className='flex flex-1 justify-start md:hidden'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <MenuIcon />
                <span className='sr-only'>Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='start'>
              {navigationData.map((item, index) => (
                <DropdownMenuItem key={index}>
                  <Link href={item.href}>{item.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className='flex justify-center md:flex-none'>
          <Link href={homeHref} className='inline-flex items-center justify-center'>
            {logoUrl ? (
              <img src={logoUrl} alt="Store logo" className="h-8 w-auto" />
            ) : (
              <div className='text-[2.1rem] font-semibold tracking-[-0.08em] text-zinc-950'>{wordmark}.</div>
            )}
          </Link>
        </div>

        <div className='hidden min-w-0 flex-1 items-center justify-end gap-5 md:flex'>
          <Link href={`${homeHref === "/" ? "" : homeHref}/cart`} className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors'>
            Cart
            <span className="relative">
              <ShoppingBag className='size-4' />
              {cartItemCount ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[0.6rem] font-semibold text-white">
                  {cartItemCount}
                </span>
              ) : null}
            </span>
          </Link>
        </div>
      </div>

      <div className='hidden border-t md:block'>
        <NavigationMenu className='mx-auto h-12 max-w-7xl px-4 sm:px-6 lg:px-8'>
          <NavigationMenuList className='flex h-full flex-wrap justify-center gap-1'>
            {navigationData.map(navItem => (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className='text-muted-foreground hover:text-foreground relative px-4 py-3 text-sm font-medium hover:bg-transparent data-[active]:text-foreground'
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}

export default Header
