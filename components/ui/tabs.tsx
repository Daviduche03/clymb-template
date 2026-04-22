"use client"

import * as React from "react"

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{ value: string; setValue: (value: string) => void } | null>(null)

const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue)

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 ${className}`}
    {...props}
  >
    {children}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value: triggerValue, children, className, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error("TabsTrigger must be used within Tabs")
    }

    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          context.value === triggerValue
            ? "bg-background text-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        } ${className}`}
        onClick={() => context.setValue(triggerValue)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: triggerValue, children, className, ...props }, ref) => {
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error("TabsContent must be used within Tabs")
    }

    return (
      <div
        ref={ref}
        className={`mt-2 ${context.value !== triggerValue ? "hidden" : ""} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }