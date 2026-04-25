import type { StorefrontConfig } from "@/lib/storefront-data"
import type { CSSProperties } from "react"
import type { ReactNode } from "react"

export function StoreThemeProvider({
  config,
  children,
}: {
  config: StorefrontConfig
  children: ReactNode
}) {
  const style: Record<string, string> = {
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.19 0.002 247.86)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.19 0.002 247.86)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.19 0.002 247.86)",
    "--muted": "oklch(0.975 0 0)",
    "--muted-foreground": "oklch(0.52 0.01 257.42)",
    "--secondary": "oklch(0.985 0 0)",
    "--secondary-foreground": "oklch(0.24 0.003 247.86)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.19 0.002 247.86)",
    "--border": "oklch(0.91 0.002 247.86)",
    "--input": "oklch(0.91 0.002 247.86)",
    "--ring": "oklch(0.42 0.004 247.86)",
    "--primary": "oklch(0.19 0.002 247.86)",
    "--primary-foreground": "oklch(0.99 0 0)",
    "--store-surface": "linear-gradient(180deg, rgba(255,255,255,0.985), rgba(248,248,247,0.94))",
    "--store-hero-glow": "radial-gradient(circle at top right, rgba(17,17,17,0.06), transparent 55%)",
    "--store-panel": "rgba(247,247,245,0.7)",
    color: "oklch(0.19 0.002 247.86)",
    backgroundColor: "oklch(1 0 0)",
  }

  if (config.theme?.primaryColor) {
    style["--primary"] = `oklch(${config.theme.primaryColor})`
  }
  if (config.theme?.accentColor) {
    style["--accent"] = `oklch(${config.theme.accentColor})`
  }

  // Only wrap with style div if there are overrides
  if (Object.keys(style).length === 0) {
    return <>{children}</>
  }

  return (
    <div style={style as CSSProperties} data-store-theme={config.id}>
      {children}
    </div>
  )
}
