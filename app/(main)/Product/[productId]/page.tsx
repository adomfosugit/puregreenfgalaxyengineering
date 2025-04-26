
import ProductDetail from "@/components/ProductDetail";
import { getProductId } from "@/lib/Appwrite/api";


export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
  const productId = await  params.productId;
  
  // Fetch sale data from the server
  const dummyProduct = await getProductId(productId);
  console.log(dummyProduct)
  return (
    <div>
      {/* @ts-ignore */}
    
      <ProductDetail details={dummyProduct} />
    </div>
  );
}
