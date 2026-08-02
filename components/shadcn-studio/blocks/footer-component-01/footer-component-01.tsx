import Link from "next/link"
import { Mail } from "lucide-react"

import { Separator } from "@/components/ui/separator"

import Logo from "@/assets/svg/logo"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
}

const Footer = ({ storeName = "shadcn/studio", logoUrl, homeHref = "/" }: FooterProps) => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link href={homeHref}>
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} className="h-8 w-auto" />
              ) : (
                <Logo className="gap-3" />
              )}
            </Link>
            <p className="max-w-xs text-sm leading-6 text-zinc-600">
              {storeName} — thoughtfully designed essentials, delivered to your door.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#collection" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  All products
                </a>
              </li>
              <li>
                <a href="#categories" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  Categories
                </a>
              </li>
              <li>
                <Link href={`${homeHref === "/" ? "" : homeHref}/cart`} className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Support</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Stay in touch</h3>
            <p className="mt-4 text-sm leading-6 text-zinc-600">New drops, restocks, and quiet seasonal edits.</p>
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-700 transition-colors hover:text-zinc-950"
            >
              <Mail className="h-4 w-4" />
              hello@useclymb.com
            </a>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <nav className="flex items-center gap-5 text-sm text-zinc-500">
            <a href="#" className="transition-colors hover:text-zinc-900">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-zinc-900">
              Terms
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
