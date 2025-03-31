
import AddNewSales from "@/components/ui/AddNewSales";
import { columns } from "./Column";
import { DataTable } from "./data-table"
import { getCustomers, getSales } from "@/lib/Appwrite/api";
import { Product } from "../Product/Column";

export type SalesOrder = {
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
};



export default async function page() {
  
  const data = await getSales()
  
  //console.log(data)
  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewSales /> 
     
      {/* @ts-ignore */}
      <DataTable columns={columns} data={data} />
    </div>
  )
}
