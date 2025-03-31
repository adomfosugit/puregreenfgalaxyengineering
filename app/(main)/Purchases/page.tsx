
import { columns } from "./Column";
import { DataTable } from "./data-table"
import AddNewPurchase from "@/components/ui/AddNewPurchase";


export type PurchaseOrder = {
  id:string;
  ProductId: string;
  Quantity: string;
  Price:number;
  Date:string;
  
};


async function getData(): Promise<PurchaseOrder[]> {
  // Fetch data from your API here.
  return [
    {
      id: 'sale-1',
      ProductId: 'SP-1001',
      Quantity: '5',
      Price: 249,
      Date: '2023-06-15'
    },
    {
      id: 'sale-2',
      ProductId: 'SP-1002',
      Quantity: '3',
      Price: 189,
      Date: '2023-07-22'
    },
    {
      id: 'sale-3',
      ProductId: 'SP-1003',
      Quantity: '2',
      Price: 319,
      Date: '2023-08-05'
    },
    {
      id: 'sale-4',
      ProductId: 'INV-2001',
      Quantity: '1',
      Price: 1299,
      Date: '2023-09-12'
    },
    {
      id: 'sale-5',
      ProductId: 'BAT-3001',
      Quantity: '1',
      Price: 6999,
      Date: '2023-10-18'
    },
    {
      id: 'sale-6',
      ProductId: 'SP-1001',
      Quantity: '10',
      Price: 249,
      Date: '2023-11-03'
    },
    {
      id: 'sale-7',
      ProductId: 'SP-1002',
      Quantity: '7',
      Price: 189,
      Date: '2023-12-10'
    },
    {
      id: 'sale-8',
      ProductId: 'SP-1003',
      Quantity: '4',
      Price: 319,
      Date: '2024-01-15'
    },
    {
      id: 'sale-9',
      ProductId: 'INV-2001',
      Quantity: '2',
      Price: 1299,
      Date: '2024-02-22'
    },
    {
      id: 'sale-10',
      ProductId: 'BAT-3001',
      Quantity: '3',
      Price: 6999,
      Date: '2024-03-05'
    },
    {
      id: 'sale-11',
      ProductId: 'SP-1001',
      Quantity: '8',
      Price: 249,
      Date: '2024-04-11'
    },
    {
      id: 'sale-12',
      ProductId: 'SP-1002',
      Quantity: '6',
      Price: 189,
      Date: '2024-05-19'
    },
    {
      id: 'sale-13',
      ProductId: 'SP-1003',
      Quantity: '3',
      Price: 319,
      Date: '2024-06-02'
    },
    {
      id: 'sale-14',
      ProductId: 'INV-2001',
      Quantity: '1',
      Price: 1299,
      Date: '2024-07-08'
    },
    {
      id: 'sale-15',
      ProductId: 'BAT-3001',
      Quantity: '2',
      Price: 6999,
      Date: '2024-08-14'
    },
    {
      id: 'sale-16',
      ProductId: 'SP-1001',
      Quantity: '12',
      Price: 249,
      Date: '2024-09-21'
    },
    {
      id: 'sale-17',
      ProductId: 'SP-1002',
      Quantity: '9',
      Price: 189,
      Date: '2024-10-27'
    },
    {
      id: 'sale-18',
      ProductId: 'SP-1003',
      Quantity: '5',
      Price: 319,
      Date: '2024-11-30'
    },
    {
      id: 'sale-19',
      ProductId: 'INV-2001',
      Quantity: '3',
      Price: 1299,
      Date: '2024-12-05'
    },
    {
      id: 'sale-20',
      ProductId: 'BAT-3001',
      Quantity: '1',
      Price: 6999,
      Date: '2025-01-10'
    }
  ];

}

export default async function page() {
  
  const data = await getData()

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewPurchase /> 
     

      <DataTable columns={columns} data={data} />
    </div>
  )
}
