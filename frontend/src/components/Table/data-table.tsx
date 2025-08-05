"use client"

import * as React from "react"
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type ColumnDef,
} from "@tanstack/react-table"
import { z } from "zod"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import styles from "./table.module.scss"

import {
  IconDotsVertical,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ActionType } from "@/components/dashboard/page"
import { StoreContext } from "@/store/storeContext"
import { DataTableToolbar } from "./data-table-toolbar"
import { Badge } from "../ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"


export type Payment = {
  id: string
  url: string
  description: string
}

const createColumns = (setIsShowEditModal: (val: boolean) => void,
  setType: (val: ActionType) => void,
  setIdItem: (val: any) => void,
  onDeleteHandler: (val: any) => void, onCreateItem: any): ColumnDef<z.infer<typeof schema>>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "url",
    //   header: "Url",
    //   cell: ({ row }) => (
    //     <div className={styles.titleWrapper}>
    //       {/* {label && <Badge variant="outline">{label.label}</Badge>} truncate*/}
    //       <span className={styles.title} >
    //         {row.getValue("url")}
    //       </span >
    //     </div >
    //   ),
    // },
    {
      accessorKey: "url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => {
        const url = row.original.url;
        const title = row.original.title;
        const tags = row.original.tags;
        const updatedAt = row.original.updated_at;
        const createdAt = row.original.created_at;
        return (
          <div className={styles.titleWrapper}>
            <div className={styles.titleWrapperContaner}>
              {title && <div className={styles.title}><h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                {title}
              </h4></div>}
              {url && <div className={styles.title}><a className={styles.btnLink} href={url} target="_blank" rel="noopener noreferrer">{url}</a> </div>}
              {tags && <div className={styles.titleTask} >{tags.map((e) => <Badge className="bg-blue-500 text-white dark:bg-blue-600">{e}</Badge>)} <p className="text-muted-foreground text-sm">{updatedAt ?? createdAt}</p></div>}
            </div>

          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      enableSorting: true,
      enableHiding: true,
      cell: ({ row }) => {


        return (
          <div className="flex space-x-2" style={{ textAlign: "left" }}>
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            <span
              className={styles.title}
            // className="max-w-[500px] truncate font-medium"
            >
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                {row.getValue("description")}
              </p>

            </span>
          </div>
        )
      },
    },
    {
      header: "",
      // id: "actions",
      accessorKey: "id",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => { setType(ActionType.EDIT); setIsShowEditModal(true); setIdItem(row.getValue("id")) }}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => { onCreateItem(row.original, true) }}>Make a copy</DropdownMenuItem>
            {/* <DropdownMenuItem>Favorite</DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => onDeleteHandler(row.getValue("id"))}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
export const schema = z.object({
  id: z.number(),
  url: z.string(),
  description: z.string(),
})

export function DataTable({
  setIsShowEditModal,
}: {
  setIsShowEditModal: (val: boolean) => void,
}) {
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const store = React.useContext(StoreContext);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns = createColumns(setIsShowEditModal, store.setType, store.setIdItem, store.onDeleteItem, store.onCreateItem);
  const data = store.items
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 m-[10px]">
        <DataTableToolbar table={table} globalFilter={globalFilter} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="m-2 overflow-hidden rounded-md border">
        <Table >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2 pr-[10px]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
