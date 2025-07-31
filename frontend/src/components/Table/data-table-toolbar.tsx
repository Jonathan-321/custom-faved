"use client"

import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"


// import { priorities, statuses } from "../data/data"
// import { DataTableFacetedFilter } from "./data-table-faceted-filter"
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
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter..."
          // value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
          // onChange={(event) =>
          //   table.getColumn("url")?.setFilterValue(event.target.value)
          // }
          value={globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}
