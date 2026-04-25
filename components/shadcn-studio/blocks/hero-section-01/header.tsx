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
  className?: string
  homeHref?: string
}

const Header = ({ navigationData, logoUrl, className, homeHref = "/" }: HeaderProps) => {
  return (
    <header className={cn('bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm', className)}>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8'>
        <div className='hidden min-w-0 flex-1 items-center md:flex'>
          <button
            type='button'
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
              <div className='text-[2.1rem] font-semibold tracking-[-0.08em] text-zinc-950'>CLYMB.</div>
            )}
          </Link>
        </div>

        <div className='hidden min-w-0 flex-1 items-center justify-end gap-5 md:flex'>
          <button type='button' className='text-muted-foreground hover:text-foreground text-xs font-medium transition-colors'>
            Account
          </button>
          <Link href={`${homeHref === "/" ? "" : homeHref}/cart`} className='text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors'>
            Cart
            <ShoppingBag className='size-4' />
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
