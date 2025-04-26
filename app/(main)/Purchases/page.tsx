
import { getPurchases } from "@/lib/Appwrite/api";
import { columns } from "./Column";
import { DataTable } from "./data-table"
import AddNewPurchase from "@/components/ui/AddNewPurchase";
import { Product } from "../Product/Column";


export type PurchaseOrder = {
  id:string;
  ProductId: string;
  Quantity: string;
  Price:number;
  Date:string;
  product: Product[]
  $createdAt: Date
};




export default async function page() {
  //@ts-ignore
  //const data:PurchaseOrder[] = await getPurchases()
  //console.log(data)

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewPurchase /> 
     

      <DataTable columns={columns} />
    </div>
  )
}
