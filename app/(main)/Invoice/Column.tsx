"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { SalesOrder } from "./page"


import Link from "next/link"

export const columns: ColumnDef<SalesOrder>[] = [
  { 
    
    accessorKey: ("$id") ,
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link href={`Invoice/${row.original.$id}`} className="text-blue-900">
          {row.original.$id}
        </Link>
      )
    }
  },
  { 
    
    accessorKey: ("$createdAt") ,
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.original.$createdAt);
      return (
        <div className="">
          {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
        </div>
      )
    }
  },
  {
    accessorKey: "customer.Name",
    id:"customer name",
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  },

  {
    accessorKey: "Price",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  
  }

]
