"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

interface NavigationItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface AppSidebarProps {
  navigation: NavigationItem[]
}

const AppSidebar = () => {
  const navigation: NavigationItem[] = [
    { label: "Dashboard", href: "/", icon: "📊" },
    { label: "Users", href: "/users", icon: "👥" },
    { label: "Settings", href: "/settings", icon: "⚙️" },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <span className="text-xl font-bold">AppName</span>
      </div>
      <nav className="flex-1 overflow-auto py-2">
        {navigation.map((item) => (
          <a
            key={item.label}
            href={item.href || "#"}
            className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            <span>{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export { AppSidebar }