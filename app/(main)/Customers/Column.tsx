"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Customer } from "./page"
import { DeleteModal } from "@/components/DeleteModal"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "Email",
    header: "Email"
  },

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
        )}
  },

  {
    accessorKey: "Phone",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Contact
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  
  },


]
