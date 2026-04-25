"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"

interface LayoutProps {
  children: React.ReactNode
}

const SidebarLayout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}

export { SidebarLayout }
