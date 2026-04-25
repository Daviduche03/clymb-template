"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const SidebarContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex min-h-screen">{children}</div>
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger() {
  const context = React.useContext(SidebarContext)

  if (!context) return null

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="m-4 md:hidden"
      onClick={() => context.setOpen(!context.open)}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}
