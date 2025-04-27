"use client"

import { DeleteModal } from "@/components/DeleteModal"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"

export type Product = {
  $id: string;
  Price: number;
  Brand:string;
  Name:string;
  Quantity:number;
  Type: string;
  Efficiency: string;
  Warranty: string;
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "Name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},

        cell: ({ row }) => {
          return (
            <Link href={`Product/${row.original.$id}`} className="text-blue-900">
              {row.original.Name}
            </Link>
          )
        }
  },
  {
    accessorKey: "Brand",
    header: "Brand",
  },
  {
    accessorKey: "Price",
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
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
    id: 'actions',
    cell: ({ row }) => (

      <DeleteModal  id = {row.original.$id} type='product'/>
    ),
  }

]
