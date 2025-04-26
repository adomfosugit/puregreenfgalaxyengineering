import { columns, Product } from "./Column"
import { DataTable } from "./data-table"
import AddNewProduct from "@/components/AddNewProduct"
import { getProducts } from "@/lib/Appwrite/api"

  
export default async function page() {
  //@ts-ignore
  const data:Product[] = await getProducts() 
 // console.log(data)

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewProduct />
     

      <DataTable columns={columns} data={data} />
    </div>
  )
}
