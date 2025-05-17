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
    accessorKey: "CustomerName",
    header: 'Customer Name'

      
  },

  {
    accessorKey: "PhoneNumber",
    header: "Contact",
  },
  {
    accessorKey: "AmountPaid",
     header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount Paid
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )}
  },

  {
    accessorKey: "advertisement",
  
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},
        cell: ({ row }) => {
          const advertisements = row.getValue("advertisement") as Array<{ $id: string }>;
          
          return (
            <div className="flex flex-col space-y-1">
              {advertisements.map((ad, index) => (
                <span key={index} className="text-wrap">{ad.Location}</span>
              ))}
            </div>
          );
        }
  },
  {
    accessorKey: "DurationMonths",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Duration(months)
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},
    
  
  },
  
  {
    accessorKey: "TenureStart",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
             Start of Tenure
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},
        cell: ({ row }) => {
          const date = new Date(row.original.TenureStart);
          return (
            <div className="">
              {date.getDate()}/{date.getMonth()+1}/{date.getFullYear()}
            </div>
          )
        }
  
  },
  {
    accessorKey: "TenureEnd",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            End of Tenure
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )},
        cell: ({ row }) => {
          const date = new Date(row.original.TenureEnd);
          return (
            <div className="">
              {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
            </div>
          )
        }
  
  },
  

]
