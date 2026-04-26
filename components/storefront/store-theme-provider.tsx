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
    "--foreground": "oklch(0.148 0.004 228.8)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.148 0.004 228.8)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.148 0.004 228.8)",
    "--muted": "oklch(0.963 0.002 197.1)",
    "--muted-foreground": "oklch(0.56 0.021 213.5)",
    "--secondary": "oklch(0.967 0.001 286.375)",
    "--secondary-foreground": "oklch(0.21 0.006 285.885)",
    "--accent": "oklch(0.963 0.002 197.1)",
    "--accent-foreground": "oklch(0.218 0.008 223.9)",
    "--border": "oklch(0.925 0.005 214.3)",
    "--input": "oklch(0.925 0.005 214.3)",
    "--ring": "oklch(0.723 0.014 214.4)",
    "--primary-foreground": "oklch(0.97 0.014 254.604)",
    color: "oklch(0.148 0.004 228.8)",
    backgroundColor: "oklch(1 0 0)",
  }

  if (config.theme?.primaryColor) {
    style["--primary"] = `oklch(${config.theme.primaryColor})`
  }
  if (config.theme?.accentColor) {
    style["--accent"] = `oklch(${config.theme.accentColor})`
  }

  return (
    <div style={style as CSSProperties} data-store-theme={config.id}>
      {children}
    </div>
  )
}
