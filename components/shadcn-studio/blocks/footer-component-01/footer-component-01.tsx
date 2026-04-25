import Link from 'next/link'
import { Globe, Mail, MessageCircle, Phone } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

import Logo from '@/assets/svg/logo'

type FooterProps = {
  storeName?: string
  logoUrl?: string
  homeHref?: string
}

const Footer = ({ storeName = "shadcn/studio", logoUrl, homeHref = "/" }: FooterProps) => {
  return (
    <footer>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <Link href={homeHref}>
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={storeName} className="h-8 w-auto" />
            ) : (
              <Logo className="gap-3" />
            )}
          </div>
        </Link>

        <div className="flex items-center gap-5 whitespace-nowrap">
          <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
            About
          </a>
          <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
            Support
          </a>
          <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
            Terms
          </a>
          <a href="#" className="opacity-80 transition-opacity duration-300 hover:opacity-100">
            Privacy
          </a>
        </div>

        <div className="flex items-center gap-4">
          <a href="#">
            <Globe className="size-5" />
          </a>
          <a href="#">
            <Mail className="size-5" />
          </a>
          <a href="#">
            <MessageCircle className="size-5" />
          </a>
          <a href="#">
            <Phone className="size-5" />
          </a>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`© ${new Date().getFullYear()}`}{" "}
          <Link href={homeHref} className="hover:underline">
            {storeName}
          </Link>
          . Made with ❤️ for better web.
        </p>
      </div>
    </footer>
  )
}

export default Footer
