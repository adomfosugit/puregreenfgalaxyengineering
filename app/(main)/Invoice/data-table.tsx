"use client"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
  } from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { getInvoice} from '@/lib/Appwrite/api'
import { Input } from "@/components/ui/input"
import { DatePickerWithRange } from "@/components/CalendarDatePicker"


interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  
}

export function DataTable<TData>({
    columns,
  
}: DataTableProps<TData>) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] =useState<ColumnFiltersState>(
        []
      )
      const [data, setData] = useState<TData[]>([])
      const [isLoading, setIsLoading] = useState(false)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    })
    useEffect(() => {
      const fetchData = async () => {
        const startDate = dateRange?.from
        const endDate = dateRange?.to
  
        if (!startDate || !endDate) return
  
        setIsLoading(true)
        try {
          const invoiceData = await getInvoice(startDate, endDate)
          {/* @ts-ignore */}
          setData(invoiceData)
        } catch (error) {
          console.error("Failed to fetch sales data:", error)
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchData()
    }, [dateRange])
  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center">
        <DatePickerWithRange 
          date={dateRange} 
          setDate={setDateRange} 
        />
      </div>
     <div className="flex items-center py-4 px-2">
        <Input
          placeholder="Filter Sales by Customer..."
          value={(table.getColumn("customer name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customer name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Table>
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
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
              {isLoading ? "Loading..." : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="ring-1 ring-primary"
        >
          Previous
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="mr-2"
        >
          Next
        </Button>
      </div>
    </div>


  )
}
