"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"

interface SelectProps<T = string> {
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
  placeholder?: string
  className?: string
}

const Select = <T,>({ value, onChange, options, placeholder = "Select...", className }: SelectProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {options.find((option) => option.value === value)?.label || placeholder}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${
                value === option.value ? "bg-accent" : ""
              }`}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
            >
              <span>{option.label}</span>
              {value === option.value && <Check className="ml-2 h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Select }