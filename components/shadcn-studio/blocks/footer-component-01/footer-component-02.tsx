import Link from "next/link"
import { Globe, Mail, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import type { StoreFooter, StoreFooterColumn } from "@/lib/types"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
  cartHref?: string
  footer?: StoreFooter
}

const Footer02 = ({
  storeName = "shadcn/studio",
  logoUrl,
  homeHref = "/",
  cartHref = "/cart",
  footer,
}: FooterProps) => {
  const defaultColumns: StoreFooterColumn[] = [
    {
      title: "Shop",
      links: [
        { label: "Collections", href: "#collection" },
        { label: "Categories", href: "#categories" },
        { label: "View Cart", href: cartHref },
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
      title: "Join the list",
      note: "Early access to drops, restocks, and quieter seasonal edits.",
    },
  ]
  const columns = footer?.columns ?? defaultColumns
  const tagline = footer?.tagline || "Elevated essentials for training, commute, and daily uniform dressing."

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.95fr_1.05fr_1fr]">
          <div className="space-y-6">
            <Link href={homeHref}>
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} data-edit-field="footer.logo" data-edit-kind="image" className="h-8 w-auto" />
              ) : (
                <div className="text-[2rem] font-semibold tracking-[-0.08em] text-zinc-950">CLYMB.</div>
              )}
            </Link>
            <p data-edit-field="footer.tagline" className="max-w-xs text-sm leading-6 text-zinc-600">
              {tagline}
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
            {columns.map((column, columnIndex) =>
              column.links?.length ? (
                <div key={`${column.title}-${columnIndex}`}>
                  <h3
                    data-edit-field={`footer.col${columnIndex}.title`}
                    className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500"
                  >
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {column.links.map((linkItem, linkIndex) => (
                      <li key={`${linkItem.label}-${linkIndex}`}>
                        <a
                          href={linkItem.href}
                          data-edit-field={`footer.col${columnIndex}.link${linkIndex}`}
                          className="text-sm text-zinc-700 transition-colors hover:text-zinc-950"
                        >
                          {linkItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>

          {columns.map((column, columnIndex) =>
            !column.links?.length ? (
              <div
                key={`${column.title}-${columnIndex}`}
                className="border border-zinc-200 bg-[var(--store-panel)] p-6"
              >
                <h3
                  data-edit-field={`footer.col${columnIndex}.title`}
                  className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-500"
                >
                  {column.title}
                </h3>
                {column.note ? (
                  <p
                    data-edit-field={`footer.col${columnIndex}.note`}
                    className="mt-4 max-w-sm text-sm leading-6 text-zinc-600"
                  >
                    {column.note}
                  </p>
                ) : null}
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
            ) : null,
          )}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} <span data-edit-field="footer.storeName">{storeName}</span>. All rights
            reserved.
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
