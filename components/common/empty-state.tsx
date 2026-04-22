"use client"

import * as React from "react"

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 text-4xl">{icon || "📋"}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {description && <p className="text-muted-foreground mb-6">{description}</p>}
    {action && <div className="flex items-center gap-2">{action}</div>}
  </div>
)

export { EmptyState }