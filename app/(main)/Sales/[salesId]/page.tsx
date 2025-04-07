
import SalesReceiptClient from "@/components/Print";
import { getSalesId } from "@/lib/Appwrite/api";

export default async function SalesReceiptPage({ params }: { params: { salesId: string } }) {
  const salesId = params.salesId;
  
  // Fetch sale data from the server
  const dummySale = await getSalesId(salesId);

  return (
    <div>
      {/* @ts-ignore */}
    
      <SalesReceiptClient sale={dummySale} />
    </div>
  );
}
