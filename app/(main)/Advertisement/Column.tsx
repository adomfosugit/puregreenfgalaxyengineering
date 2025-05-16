"use client"

import { DeleteModal } from "@/components/DeleteModal"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import Link from "next/link"

export type Product = {
  $id: string;
  Price: number;
  Location:string;
  Name:string;
  Quantity:number;
  category: string;
  Status: 'Available' | 'Rented'
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
            <Link href={`Advertisement/${row.original.$id}`} className="text-blue-900">
              {row.original.Name}
            </Link>
          )
        }
  },
  {
    accessorKey: "Location",
    header: "location",
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
  

]
