import Link from "next/link"
import { Mail } from "lucide-react"

import { Separator } from "@/components/ui/separator"

import Logo from "@/assets/svg/logo"
import type { StoreFooter, StoreFooterColumn } from "@/lib/types"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
  footer?: StoreFooter
}

const Footer = ({ storeName = "shadcn/studio", logoUrl, homeHref = "/", footer }: FooterProps) => {
  const cartHref = `${homeHref === "/" ? "" : homeHref}/cart`
  const defaultColumns: StoreFooterColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "All products", href: "#collection" },
        { label: "Categories", href: "#categories" },
        { label: "Cart", href: cartHref },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Shipping", href: "#" },
        { label: "Returns", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Stay in touch",
      note: "New drops, restocks, and quiet seasonal edits.",
      links: [{ label: "hello@useclymb.com", href: "#" }],
    },
  ]
  const columns = footer?.columns ?? defaultColumns
  const tagline = footer?.tagline || `${storeName} — thoughtfully designed essentials, delivered to your door.`

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link href={homeHref}>
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} data-edit-field="footer.logo" data-edit-kind="image" className="h-8 w-auto" />
              ) : (
                <Logo className="gap-3" />
              )}
            </Link>
            <p data-edit-field="footer.tagline" className="max-w-xs text-sm leading-6 text-zinc-600">
              {tagline}
            </p>
          </div>

          {columns.map((column, columnIndex) => (
            <div key={`${column.title}-${columnIndex}`}>
              <h3 data-edit-field={`footer.col${columnIndex}.title`} className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                {column.title}
              </h3>
              {column.note ? (
                <p data-edit-field={`footer.col${columnIndex}.note`} className="mt-4 text-sm leading-6 text-zinc-600">
                  {column.note}
                </p>
              ) : null}
              {column.links?.length ? (
                <ul className="mt-4 space-y-3">
                  {column.links.map((linkItem, linkIndex) => (
                    <li key={`${linkItem.label}-${linkIndex}`}>
                      <a
                        href={linkItem.href}
                        data-edit-field={`footer.col${columnIndex}.link${linkIndex}`}
                        className="inline-flex items-center gap-2 text-sm text-zinc-700 transition-colors hover:text-zinc-950"
                      >
                        {linkItem.label.includes("@") ? <Mail className="h-4 w-4" /> : null}
                        {linkItem.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} <span data-edit-field="footer.storeName">{storeName}</span>. All rights
            reserved.
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
