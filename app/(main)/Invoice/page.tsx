

import { columns } from "./Column";
import { DataTable } from "./data-table"
import {  getInvoice} from "@/lib/Appwrite/api";
import { Product } from "../Product/Column";
import AddNewInvoice from "@/components/ui/AddNewInvoice";

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
  
  const data = await getInvoice()
  
  //console.log(data)
  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewInvoice /> 

         {/* @ts-ignore */}
         <DataTable columns={columns} data={data} />

    </div>
  )
}
