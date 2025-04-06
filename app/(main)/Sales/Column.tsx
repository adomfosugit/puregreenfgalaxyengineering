"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { SalesOrder } from "./page"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
import { format } from 'date-fns';

export const columns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "$id",
    header: "Order Id"
  },
  { 
    
    accessorKey: ("$createdAt") ,
     header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Order Date
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
            Sales Order Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  
  }

]
