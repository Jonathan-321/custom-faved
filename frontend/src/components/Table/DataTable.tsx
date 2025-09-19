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
import { StoreContext } from "@/store/storeContext"
import { DataTableToolbar } from "./DataTableToolbar"
import { Badge } from "../ui/badge"
import { colorMap } from "@/lib/utils.ts";
import { observer } from "mobx-react-lite"
import { PopoverSort } from "./PopoverSort"
import { Popover } from "../ui/popover"
import { ActionType } from "../dashboard/types"
import { DataTablePagination } from "./data-table-pagination"
import { CardView } from "./CardView"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Card } from "../ui/card"
import { ItemType } from "@/types/types"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import { Blocks as BlocksIcon, Table as TableIcon } from "lucide-react"


export type Payment = {
  id: string
  url: string
  description: string
}

const createColumns = (setIsShowEditModal: (val: boolean) => void,
                       setType: (val: ActionType) => void,
                       setIdItem: (val: number) => void,
                       onDeleteHandler: (val: number) => void,
                       onCreateItem: any,
                       tagList: object,
): ColumnDef<z.infer<typeof schema>>[] => [
  {
    accessorKey: "url",
    header: 'url',
    enableSorting: true,
    enableHiding: false,
    cell: observer(({ row }) => {
      const item = row.original;
      const url = item.url;
      const title = item.title;
      const tags = item.tags;
      const updatedAt = item.updated_at;
      const createdAt = item.created_at;

      return (
        <div className="flex flex-col items-start w-full text-left wrap-anywhere gap-2">
          {title &&
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight line-clamp-3" title={title}>
                {title}
              </h4>
          }
          {url &&
              <a className="text-custom-blue underline line-clamp-3 break-all" href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
          }
          {tags && <div className="flex flex-start text-left w-full flex-wrap py-2">
            {tags.map((tagID) => {
              const fullPath = tagList[tagID]?.fullPath.replaceAll('\\/', '/');
              const tagName = tagList[tagID]?.title;
              const [isHovered, setIsHovered] = React.useState(false);
              const store = React.useContext(StoreContext);

              const setTag = () => {
                store.setCurrentTagId(tagID);
                store.setCurrentPage(1);
              }

              return (
                <Badge
                  key={tagID}
                  variant={'secondary'}
                  className="mr-2 mb-2 cursor-pointer"
                  onClick={setTag}
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
          <div className="text-muted-foreground text-sm mt-auto">
            <small className="text-sm leading-none font-medium">Created at:</small> {updatedAt ?? createdAt}
          </div>
        </div>

      );
    }),
  },
  {
    accessorKey: "description",
    header: 'description',
    enableSorting: true,
    enableHiding: false,
    cell: ({ row }) => {
      const comments = row.original.comments;
      const imageUrl = row.original.image;
      const description = row.original.description;

      return (
        <div className="flex flex-col items-start text-start w-full flex-wrap">
          {imageUrl &&
              <a href={imageUrl} target="_blank">
                  <img className="w-auto h-auto max-h-[200px] rounded-sm" src={imageUrl} />
              </a>
          }
          {description && (<p className="leading-7 [&:not(:first-child)]:mt-6 whitespace-pre-line">
            {description}
          </p>)}
          {comments && (<blockquote className="mt-6 border-l-2 pl-6 italic whitespace-pre-line">{comments}</blockquote>)}
        </div >
      )
    },
  },
  {
    accessorKey: "title",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "updated_at",
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "comments",
    enableSorting: true,
    enableHiding: true,
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
            variant="outline"
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-destructive/90 hover:text-white"
              >
                Delete
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteHandler(row.getValue("id"))}
                  className="w-full sm:w-auto order-first sm:order-last mt-2 sm:mt-0 bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
export const schema = z.object({
  id: z.number(),
  url: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  title: z.string(),
  image: z.string(),
  tags: z.array(z.number()),
  comments: z.string(),
})

export const DataTable: React.FC<{ setIsShowEditModal: (val: boolean) => void }> = observer(({ setIsShowEditModal }) => {
    const [globalFilter, setGlobalFilter] = React.useState<any>([]);
    const store = React.useContext(StoreContext);
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [selectedSortColumn, setSelectedSortColumn] = React.useState<string | null>(null);
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const columns: ColumnDef<ItemType>[] = createColumns(setIsShowEditModal, store.setType, store.setIdItem, store.onDeleteItem, store.onCreateItem, store.tags) as unknown as ColumnDef<ItemType>[];
    const data = store.selectedTagId === '0' ? store.items : store.items.filter((item => {
      return (store.selectedTagId === null && item.tags.length === 0) || item.tags.includes(Number(store.selectedTagId) as unknown as string);
    }))
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
      globalFilterFn: (row, columnId, value, addMeta) => {
        const searchValue = String(value).toLocaleLowerCase().trim();

        if (searchValue === "") {
          return true;
        }

        const searchTerms = searchValue.split(/[ ,.;\t\n]+/).filter(term => term !== "");

        return searchTerms.every(term => {
          for (const cell of row.getAllCells()) {
            const cellValue = String(cell.getValue()).toLocaleLowerCase();

            if (cellValue.includes(term)) {
              store.setCurrentPage(1)
              return true;
            }
          }
          return false;
        });
      },
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
    const sortableColumns = columns.filter((column) => column.enableSorting);

    const [showSort, setShowSort] = React.useState(false);
    const handleSortChange = (columnAccessorKey: string, sortDirection: 'asc' | 'desc') => {
      store.setCurrentPage(1);
      if (columnAccessorKey === "") {
        setSorting([]);
        setSelectedSortColumn(null);
        return;
      }

      setSelectedSortColumn(columnAccessorKey);

      const currentSort = sorting[0];
      const isCurrentColumn = currentSort?.id === columnAccessorKey;

      const newSortDesc = sortDirection === 'desc' || (!isCurrentColumn ? false : !currentSort?.desc)

      setSorting([{
        id: columnAccessorKey,
        desc: newSortDesc,
      }]);
    };

    React.useEffect(() => {
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== "undefined" && column.getCanHide()
        )
        .map((column) => {
          column.toggleVisibility(false)
        })
    }, [])
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 py-4 m-[14px]">
          <DataTableToolbar table={table} globalFilter={globalFilter} />
          <Popover open={showSort} onOpenChange={setShowSort}>
            <PopoverSort
              selectedSortColumn={selectedSortColumn}
              handleSortChange={handleSortChange}
              sortableColumns={sortableColumns}
            />
          </Popover>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => {
                store.setIsTableView(!store.isTableView);
                store.setItems(store.itemsOriginal)

              }} variant="outline">
                {!store.isTableView ? <TableIcon /> : <BlocksIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {!store.isTableView ? "Table view" : "Card view"}</p>
            </TooltipContent>
          </Tooltip>

        </div>

        <div className="m-2 overflow-hidden ">
          {store.isTableView ? <Table className=" table-fixed w-full">
              <TableBody>
                {currentRows.length ? (
                  currentRows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id} className={`${cell.id.split("_")[1] !== "id" ? 'w-full pb-5 pt-5 break-words ' : 'pb-5 pt-5 w-12' }`}>
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
            </Table> :
            <div className="grid grid-cols-1 gap-4 px-1 lg:px-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {currentRows.length > 0 ? (
                currentRows.map((row) => {
                  const el = row.original;
                  return (
                    <Card key={el.id} className="@container/card relative">
                      <CardView setIsShowEditModal={setIsShowEditModal} el={el} />
                    </Card>)

                })
              ) : (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No results found.
                </div>
              )}
            </div >
          }
        </div>
        <DataTablePagination table={table} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
      </div>
    )
  }
)