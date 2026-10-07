import Link from "next/link"

import type { StoreFooter, StoreFooterColumn } from "@/lib/types"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
  cartHref?: string
  footer?: StoreFooter
}

const Footer03 = ({
  storeName = "CLYMB.",
  logoUrl,
  homeHref = "/",
  cartHref = "/cart",
  footer,
}: FooterProps) => {
  const defaultColumns: StoreFooterColumn[] = [
    {
      links: [
        { label: "Home", href: homeHref },
        { label: "Collection", href: "#collection" },
        { label: "Categories", href: "#categories" },
      ],
    },
    {
      links: [
        { label: "Cart", href: cartHref },
        { label: "Shipping", href: "#" },
        { label: "Returns", href: "#" },
      ],
    },
  ]
  const columns = footer?.columns ?? defaultColumns
  const tagline =
    footer?.tagline ||
    "Premium essentials with quieter branding, better fabric choices, and a sharper everyday uniform."

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <Link href={homeHref} className="inline-flex items-center">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} data-edit-field="footer.logo" data-edit-kind="image" className="h-8 w-auto" />
            ) : (
              <div className="text-[2rem] font-semibold tracking-[-0.08em] text-zinc-950">
                <span data-edit-field="footer.storeName">{storeName}</span>
              </div>
            )}
          </Link>
          <p data-edit-field="footer.tagline" className="mt-5 max-w-md text-sm leading-6 text-zinc-600">
            {tagline}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm text-zinc-700">
          {columns.map((column, columnIndex) => (
            <div key={`footer-column-${columnIndex}`} className="space-y-3">
              {column.title ? (
                <p
                  data-edit-field={`footer.col${columnIndex}.title`}
                  className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500"
                >
                  {column.title}
                </p>
              ) : null}
              {column.links?.map((linkItem, linkIndex) => (
                <a
                  key={`${linkItem.label}-${linkIndex}`}
                  href={linkItem.href}
                  data-edit-field={`footer.col${columnIndex}.link${linkIndex}`}
                  className="block hover:text-zinc-950"
                >
                  {linkItem.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs uppercase tracking-[0.2em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>
            &copy; {new Date().getFullYear()} <span data-edit-field="footer.storeName">{storeName}</span>
          </span>
          <span>Minimal retail system</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer03
