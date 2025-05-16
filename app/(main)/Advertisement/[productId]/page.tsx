
import AdvertisementDetail from "@/components/AdvertisementDetails";
import ProductDetail from "@/components/ProductDetail";
import { getAdvertisementId } from "@/lib/Appwrite/api";


export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const productId = await  params.productId;
  
  // Fetch sale data from the server
  const dummyProduct = await getAdvertisementId(productId);
  console.log(dummyProduct)
  return (
    <div>
      {/* @ts-ignore */}
    
      <AdvertisementDetail details={dummyProduct} />
    </div>
  );
}
