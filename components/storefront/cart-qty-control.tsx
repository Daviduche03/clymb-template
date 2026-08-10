"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CartQtyControlProps = {
  quantity: number
  onDecrement: () => void
  onIncrement: () => void
  className?: string
  compact?: boolean
}

export function CartQtyControl({
  quantity,
  onDecrement,
  onIncrement,
  className,
  compact = false,
}: CartQtyControlProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center border border-zinc-200 bg-white",
        compact ? "h-8" : "h-9",
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-none hover:bg-zinc-50", compact ? "h-8 w-8" : "h-9 w-9")}
        onClick={onDecrement}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className={cn("min-w-8 text-center text-sm font-medium text-zinc-900", compact ? "px-1" : "px-2")}>
        {quantity}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("rounded-none hover:bg-zinc-50", compact ? "h-8 w-8" : "h-9 w-9")}
        onClick={onIncrement}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}