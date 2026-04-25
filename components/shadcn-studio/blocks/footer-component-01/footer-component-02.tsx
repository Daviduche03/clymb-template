import Link from "next/link"
import { Globe, Mail, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
  cartHref?: string
}

const Footer02 = ({
  storeName = "shadcn/studio",
  logoUrl,
  homeHref = "/",
  cartHref = "/cart",
}: FooterProps) => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr_1fr]">
          <div className="space-y-6">
            <Link href={homeHref}>
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} className="h-8 w-auto" />
              ) : (
                <div className="text-[2rem] font-semibold tracking-[-0.08em] text-zinc-950">CLYMB.</div>
              )}
            </Link>
            <p className="max-w-xs text-sm leading-6 text-zinc-600">
              Elevated essentials for training, commute, and daily uniform dressing.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-900">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-900">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-900">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-900">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
                Shop
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#collection" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="#categories" className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                    Categories
                  </a>
                </li>
                <li>
                  <Link href={cartHref} className="text-sm text-zinc-700 transition-colors hover:text-zinc-950">
                    View Cart
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
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
          </div>

          <div className="border border-zinc-200 bg-[var(--store-panel)] p-6">
            <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500">
              Join the list
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-600">
              Early access to drops, restocks, and quieter seasonal edits.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:max-w-md">
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 w-full min-w-0 appearance-none rounded-none border-zinc-300 bg-white px-4 py-2"
              />
              <Button type="button" className="h-12 rounded-none text-xs uppercase tracking-[0.24em]">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">USD ($)</span>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">English</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer02
