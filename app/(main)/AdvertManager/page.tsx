import AddNewAdvertisement from "@/components/AddNewAdvertisement"
import { columns, Product } from "./Column"
import { DataTable } from "./data-table"
import { getAdvertisement, getProducts } from "@/lib/Appwrite/api"

  
export default async function page() {
  //@ts-ignore
  const data:Product[] = await getAdvertisement() 
 // console.log(data)

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewAdvertisement />
      <DataTable columns={columns} data={data} />  
    </div>
  )
}
