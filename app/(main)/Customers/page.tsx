
import AddNewCustomer from "@/components/ui/AddNewCustomer";
import { columns } from "./Column";
import { DataTable } from "./data-table"


export type Customer = {
    id:string;
    name: string;
    email: string;
    contact: string;

}


async function getData(): Promise<Customer[]> {
  // Fetch data from your API here.
  return[
    {
      id: 'cust-1',
      name: 'Solar Solutions Inc.',
      email: 'sales@solarsolutions.com',
      contact: '+1 (555) 123-4567'
    },
    {
      id: 'cust-2',
      name: 'Green Energy Co-op',
      email: 'orders@greencoop.org',
      contact: '+1 (555) 234-5678'
    },
    {
      id: 'cust-3',
      name: 'EcoHome Installations',
      email: 'contact@ecohome.com',
      contact: '+1 (555) 345-6789'
    },
    {
      id: 'cust-4',
      name: 'Sunshine Farms',
      email: 'manager@sunshinefarms.com',
      contact: '+1 (555) 456-7890'
    },
    {
      id: 'cust-5',
      name: 'Bright Future Solar',
      email: 'info@brightfuturesolar.com',
      contact: '+1 (555) 567-8901'
    },
    {
      id: 'cust-6',
      name: 'PowerSave Energy',
      email: 'sales@powersave.com',
      contact: '+1 (555) 678-9012'
    },
    {
      id: 'cust-7',
      name: 'SolarTech Professionals',
      email: 'support@solartechpros.com',
      contact: '+1 (555) 789-0123'
    },
    {
      id: 'cust-8',
      name: 'Renewable Power Systems',
      email: 'orders@renewablepower.com',
      contact: '+1 (555) 890-1234'
    },
    {
      id: 'cust-9',
      name: 'SunHarvest Energy',
      email: 'customerservice@sunharvest.com',
      contact: '+1 (555) 901-2345'
    },
    {
      id: 'cust-10',
      name: 'EcoPower Solutions',
      email: 'sales@ecopower.com',
      contact: '+1 (555) 012-3456'
    },
    {
      id: 'cust-11',
      name: 'Advanced Solar Technologies',
      email: 'info@advancedsolar.com',
      contact: '+1 (555) 123-9876'
    },
    {
      id: 'cust-12',
      name: 'Pure Energy Installers',
      email: 'contact@pureenergy.com',
      contact: '+1 (555) 234-8765'
    },
    {
      id: 'cust-13',
      name: 'SunRay Power Systems',
      email: 'support@sunraypower.com',
      contact: '+1 (555) 345-7654'
    },
    {
      id: 'cust-14',
      name: 'GreenTech Solar',
      email: 'sales@greentechsolar.com',
      contact: '+1 (555) 456-6543'
    },
    {
      id: 'cust-15',
      name: 'Efficient Energy Solutions',
      email: 'orders@efficientenergy.com',
      contact: '+1 (555) 567-5432'
    },
    {
      id: 'cust-16',
      name: 'SolarVision Enterprises',
      email: 'info@solarvision.com',
      contact: '+1 (555) 678-4321'
    },
    {
      id: 'cust-17',
      name: 'SunPower Distributors',
      email: 'sales@sunpowerdist.com',
      contact: '+1 (555) 789-3210'
    },
    {
      id: 'cust-18',
      name: 'EcoSolar Installations',
      email: 'support@ecosolar.com',
      contact: '+1 (555) 890-2109'
    },
    {
      id: 'cust-19',
      name: 'Renewable Energy Partners',
      email: 'contact@renewablepartners.com',
      contact: '+1 (555) 901-1098'
    },
    {
      id: 'cust-20',
      name: 'SolarEdge Technologies',
      email: 'orders@solaredgetech.com',
      contact: '+1 (555) 012-0987'
    }
]
}

export default async function page() {
  
  const data = await getData()

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewCustomer /> 
     

      <DataTable columns={columns} data={data} />
    </div>
  )
}
