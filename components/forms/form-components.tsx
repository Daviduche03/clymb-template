"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  error?: string
  required?: boolean
}

const FormField = ({ label, name, type = "text", placeholder, error, required = false }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={name} className={error ? "text-destructive" : ""}>
      {label}{required && "*"}
    </Label>
    <Input
      id={name}
      name={name}
      type={type}
      placeholder={placeholder}
      className={error ? "border-destructive" : ""}
    />
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
)

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

const FormSection = ({ title, description, children }: FormSectionProps) => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
    <div className="grid gap-6">{children}</div>
  </div>
)

interface SubmitButtonProps {
  loading?: boolean
  children?: React.ReactNode
}

const SubmitButton = ({ loading, children }: SubmitButtonProps) => (
  <Button type="submit" disabled={loading} className="w-full md:w-auto">
    {loading ? "Saving..." : children}
  </Button>
)

export { FormField, FormSection, SubmitButton }