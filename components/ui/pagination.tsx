"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblings?: number
}

const Pagination = ({ currentPage, totalPages, onPageChange, siblings = 1 }: PaginationProps) => {
  const getPageNumbers = () => {
    const totalNumbers = siblings * 2 + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const startPage = Math.max(2, currentPage - siblings)
    const endPage = Math.min(totalPages - 1, currentPage + siblings)

    const showLeftDots = startPage > 2
    const showRightDots = endPage < totalPages - 1

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 1 + siblings * 2 + 1
      return [
        ...Array.from({ length: leftItemCount }, (_, i) => i + 1),
        '...',
        totalPages,
      ]
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 1 + siblings * 2 + 1
      return [
        1,
        '...',
        ...Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1),
      ]
    }

    return [
      1,
      ...(showLeftDots ? ['...'] : []),
      ...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i),
      ...(showRightDots ? ['...'] : []),
      totalPages,
    ]
  }

  const pages = getPageNumbers()

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded border p-0 disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="h-10 px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`flex h-10 w-10 items-center justify-center rounded border ${
              currentPage === page ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            {page}
          </button>
        )
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded border p-0 disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}

export { Pagination }