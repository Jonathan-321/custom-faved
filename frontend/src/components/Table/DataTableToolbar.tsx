"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: any;
}

export function DataTableToolbar<TData>({
  table,
  globalFilter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between flex-grow">
        <Input
          placeholder="Search..."
          value={globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="h-9"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
    </div>
  )
}
