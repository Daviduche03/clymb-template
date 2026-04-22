"use client"

import * as React from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg border p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded p-2 hover:bg-accent transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}

export { Modal }