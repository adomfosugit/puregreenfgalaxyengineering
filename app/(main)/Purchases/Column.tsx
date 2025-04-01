"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { PurchaseOrder } from "./page"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "$id",
    header: "Purchase Id"
  },
  {
    accessorKey: "$createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchase Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )}
  },

  {
    accessorKey: "product.Name",
    id:'productName',
    
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},
        //@ts-ignore
      // cell: ({ row }) => (<div className="">{row.original.product.Name }</div>)
  },

  {
    accessorKey: "product",
     id:'Price',
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},

        //@ts-ignore
     cell: ({ row }) => (<div className="capitalize">{row.original.product.Price}</div>)
  },

  {
    accessorKey: "Quantity",
    
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  },
 
  {
    accessorKey: "Uploader",    
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Uploaded By
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  },



]
