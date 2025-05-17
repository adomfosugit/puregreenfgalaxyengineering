import AddNewAdvertisement from "@/components/AddNewAdvertisement"
import { columns, Product } from "./Column"
import { DataTable } from "./data-table"
import { getAdvert, getAdvertisement, getProducts } from "@/lib/Appwrite/api"
import AddNewAdvertisementDeal from "@/components/AddNewAdvetisementDeal"

  
export default async function page() {
  //@ts-ignore
  const data:Product[] = await getAdvert() 
 // console.log(data)

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewAdvertisementDeal />
      <DataTable columns={columns} data={data} />  
    </div>
  )
}
