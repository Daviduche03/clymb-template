"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline"
  children: React.ReactNode
  className?: string
}

const Badge = ({ variant = "default", className, children }: BadgeProps) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input text-foreground",
  }

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}

export { Badge }