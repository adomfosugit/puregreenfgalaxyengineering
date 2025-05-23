
import SalesReceiptClient from "@/components/Print";
import { getInvoicesId, getSalesId } from "@/lib/Appwrite/api";

export default async function SalesReceiptPage({ params }: { params: { salesId: string } }) {
  const salesId = await  params.salesId;
  
  // Fetch sale data from the server
  const dummySale = await getInvoicesId(salesId);
  console.log(dummySale)
  return (
    <div>
      {/* @ts-ignore */}
    
      <SalesReceiptClient sale={dummySale}  type='invoice'/>
    </div>
  );
}
