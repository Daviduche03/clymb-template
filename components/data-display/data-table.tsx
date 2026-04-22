"use client"

import * as React from "react"
import { ArrowUpDown, ChevronDown } from "lucide-react"

interface DataTableColumn<T> {
  accessorKey: keyof T
  header: string
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  onRowClick?: (row: T) => void
  loading?: boolean
}

const DataTable = <T,>({ data, columns, onRowClick, loading }: DataTableProps<T>) => {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.accessorKey)}
                className={`h-10 px-4 text-left align-middle font-medium ${
                  column.sortable ? "cursor-pointer select-none" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && <ArrowUpDown className="h-3 w-3" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className={`border-t transition-colors hover:bg-muted/50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={String(column.accessorKey)} className="p-4 align-middle">
                    {column.cell ? column.cell(row) : String(row[column.accessorKey])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export { DataTable }