
import AddNewCustomer from "@/components/ui/AddNewCustomer";
import { columns } from "./Column";
import { DataTable } from "./data-table"
import { getCustomers } from "@/lib/Appwrite/api";


export type Customer = {
    
    name: string;
    email: string;
    phone: string;
  

}



export default async function page() {
  //@ts-ignore
 // const data: Customer = await getCustomers()
  //console.log(data)

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewCustomer /> 
     
    {/* @ts-ignore */}
      <DataTable columns={columns}  />
    </div>
  )
}
