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
import styles from "./table.module.scss"
import {
  IconDotsVertical,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { ActionType } from "@/components/dashboard/page"
import { StoreContext } from "@/store/storeContext"
import { DataTableToolbar } from "./data-table-toolbar"
import { Badge } from "../ui/badge"
import { colorMap } from "@/lib/utils.ts";
import { observer } from "mobx-react-lite"


export type Payment = {
  id: string
  url: string
  description: string
}

const createColumns = (setIsShowEditModal: (val: boolean) => void,
  setType: (val: ActionType) => void,
  setIdItem: (val: any) => void,
  onDeleteHandler: (val: any) => void,
  onCreateItem: any,
  tagList: Object): ColumnDef<z.infer<typeof schema>>[] => [
    {
      accessorKey: "url",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Title" />
      // ),
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const url = row.original.url;
        const title = row.original.title;
        const tags = row.original.tags;
        const updatedAt = row.original.updated_at;
        const createdAt = row.original.created_at;
        const getTagName = (fullPath) => {
          const lastSlashIndex = fullPath.lastIndexOf('/');
          if (lastSlashIndex === -1) {
            return fullPath;
          } else {
            return fullPath.substring(lastSlashIndex);
          }
        };
        return (
          <div className="flex flex-col items-start w-full flex-wrap w-[400px] table-layout-fixed">
            {title && <span className="flex items-start text-left w-full flex-wrap pb-2"><h4 className="scroll-m-20 text-xl font-semibold tracking-tight "> {title} </h4></span>}
            {url && <span className="pb-2"><a className={styles.btnLink} href={url} target="_blank" rel="noopener noreferrer">{url}</a></span>}

            {/* {
              tags && <div className="flex items-start text-left w-full flex-wrap pb-2">
                {tags.map((tagID) => {
                  console.log(' {tagList[tagID]?.fullPath}', tagList[tagID]?.fullPath)
                  return <Badge className="mr-2 bg-white text-gray border-1 border-gray dark:bg-blue-600 ">
                    <span className={`w-3  h-3 rounded-full inline-block mr-1 ${colorMap[tagList[tagID]?.color || 'gray']}`}></span>
                    {tagList[tagID]?.fullPath}
                  </Badge>
                })}
              </div>
            } */}
            {tags && <div className="flex flex-start text-left w-full flex-wrap pb-2">
              {tags.map((tagID) => {
                const fullPath = tagList[tagID]?.fullPath;
                const tagName = getTagName(fullPath);
                const [isHovered, setIsHovered] = React.useState(false);

                return (
                  <Badge
                    key={tagID}
                    variant={'secondary'}
                    className="mr-2 mb-2"
                    // className="mr-2 mb-2 bg-white text-gray border border-gray relative" // Добавили relative для позиционирования tooltip
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span
                      className={`w-3 h-3 rounded-full inline-block mr-1 ${colorMap[tagList[tagID]?.color || 'gray']}`}
                    ></span>
                    <span>{isHovered ? fullPath : tagName}</span>
                    {isHovered && (
                      <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded z-10">
                        {fullPath}
                      </div>
                    )}
                  </Badge>
                );
              })}
            </div>}
            <div>
              <p className="text-muted-foreground text-sm">{updatedAt ?? createdAt}</p>
            </div>
          </div >
        );
      },
    },
    {
      accessorKey: "description",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Description" />
      // ),
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col items-start w-full flex-wrap">
            <div className="flex flex-col items-start text-start">
              <div>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  {row.getValue("description")}
                </p>

              </div>
            </div >
          </div >
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

export const DataTable: React.FC<{ setIsShowEditModal: (val: boolean) => void }> = observer(({ setIsShowEditModal }) => {
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const store = React.useContext(StoreContext);
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const columns = createColumns(setIsShowEditModal, store.setType, store.setIdItem, store.onDeleteItem, store.onCreateItem, store.tags);
  const data = store.items
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex: store.currentPage - 1,
        pageSize: rowsPerPage,
      },
    },
    onPaginationChange: (updaterOrValue) => {
      const newPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(table.getState().pagination)
          : updaterOrValue;

      store.setCurrentPage(newPagination.pageIndex + 1);
      setRowsPerPage(newPagination.pageSize);
    },
  })
  const startIndex = (store.currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = table.getRowModel().rows.slice(startIndex, endIndex);
  return (
    <div className="w-full">
      <div className="flex items-center py-4 m-[10px]">
        <DataTableToolbar table={table} globalFilter={globalFilter} />
      </div>

      <div className="m-2 overflow-hidden ">
        <Table className="table-layout-fixed w-[100%]">
          <TableBody>
            {currentRows.length ? (
              currentRows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    console.log('cell.id.split("_")', cell.id.split("_"))

                    return (
                      <TableCell key={cell.id} className={`${cell.id.split("_")[1] !== "id" ? 'w-[45%] pb-5 pt-5' : 'w-[3%] pb-5 pt-5'}`}>
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
        {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
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
)