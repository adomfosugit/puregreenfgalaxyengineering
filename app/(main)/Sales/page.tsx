
import AddNewSales from "@/components/ui/AddNewSales";
import { columns } from "./Column";
import { DataTable } from "./data-table"
import {  getSales } from "@/lib/Appwrite/api";
import { Product } from "../Product/Column";
import { SalesTable } from "@/components/SalesTale";

export type SalesOrder = {
  $id:string;
  orderId: string;
  orderDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  Quantity:number;
  Price:number;
  product: Product[]
  $createdAt:Date
};



export default async function page() {
  
  //const data = await getSales()

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewSales /> 

         {/* @ts-ignore */}
        {/* <DataTable columns={columns} data={data} /> */}
        <SalesTable  columns= {columns}/>

    </div>
  )
}
