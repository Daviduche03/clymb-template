"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"

interface StatusPillProps {
  status: "active" | "inactive" | "pending" | "error"
  children?: React.ReactNode
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
}

const StatusPill = ({ status, children }: StatusPillProps) => (
  <Badge variant="outline" className={`${statusColors[status]} border-0`}>
    {children || status}
  </Badge>
)

interface TagProps {
  variant?: "default" | "outline" | "secondary"
  children: React.ReactNode
}

const Tag = ({ variant = "default", children }: TagProps) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-input text-foreground",
    secondary: "bg-secondary text-secondary-foreground",
  }
  return <Badge variant={variant}>{children}</Badge>
}

export { StatusPill, Tag }