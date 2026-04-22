"use client"

import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <div className="space-y-2">
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive" : "border-input"} ${className}`}
      ref={ref}
      {...props}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
))
Input.displayName = "Input"

export { Input }