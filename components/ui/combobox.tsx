"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

interface ComboboxProps<T> {
  options: T[]
  valueExtractor: (item: T) => string
  labelExtractor: (item: T) => string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const Combobox = <T,>({
  options,
  valueExtractor,
  labelExtractor,
  value,
  onChange,
  placeholder = "Select...",
}: ComboboxProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!query) return options
    return options.filter((option) =>
      labelExtractor(option).toLowerCase().includes(query.toLowerCase())
    )
  }, [options, query])

  return (
    <div className="relative">
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {options.find((option) => valueExtractor(option) === value)?.label || placeholder}
        </span>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          <input
            type="text"
            className="h-10 w-full rounded-t-md border-b border-input bg-transparent px-3 text-sm outline-none"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {filteredOptions.map((option) => (
            <button
              key={valueExtractor(option)}
              type="button"
              className={`flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-accent ${
                value === valueExtractor(option) ? 'bg-accent' : ''
              }`}
              onClick={() => {
                onChange(valueExtractor(option))
                setIsOpen(false)
              }}
            >
              <span>{labelExtractor(option)}</span>
              {value === valueExtractor(option) && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export { Combobox }