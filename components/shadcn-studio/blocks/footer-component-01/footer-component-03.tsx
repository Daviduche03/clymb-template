import Link from "next/link"

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
  cartHref?: string
}

const Footer03 = ({
  storeName = "CLYMB.",
  logoUrl,
  homeHref = "/",
  cartHref = "/cart",
}: FooterProps) => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <Link href={homeHref} className="inline-flex items-center">
            {logoUrl ? <img src={logoUrl} alt={storeName} className="h-8 w-auto" /> : <div className="text-[2rem] font-semibold tracking-[-0.08em] text-zinc-950">{storeName}</div>}
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-zinc-600">
            Premium essentials with quieter branding, better fabric choices, and a sharper everyday uniform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm text-zinc-700">
          <div className="space-y-3">
            <Link href={homeHref} className="block hover:text-zinc-950">Home</Link>
            <a href="#collection" className="block hover:text-zinc-950">Collection</a>
            <a href="#categories" className="block hover:text-zinc-950">Categories</a>
          </div>
          <div className="space-y-3">
            <Link href={cartHref} className="block hover:text-zinc-950">Cart</Link>
            <a href="#" className="block hover:text-zinc-950">Shipping</a>
            <a href="#" className="block hover:text-zinc-950">Returns</a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-xs uppercase tracking-[0.2em] text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>&copy; {new Date().getFullYear()} {storeName}</span>
          <span>Minimal retail system</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer03
