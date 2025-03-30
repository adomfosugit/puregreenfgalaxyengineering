"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  Price: number
  Brand:string;
  Name:string;
  Quantity:number;
  Type: string;
  Efficiency: string;
  Warranty: string;
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "Name",
    header: "Name",
  },
  {
    accessorKey: "Brand",
    header: "Brand",
  },
  {
    accessorKey: "Price",
    header: "Price",
  },
  {
    accessorKey: "Quantity",
    header: "Quantity",
  },

]
