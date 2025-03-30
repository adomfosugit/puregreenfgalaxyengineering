import { Button } from "@/components/ui/button"
import { columns, Payment } from "./Column"
import { DataTable } from "./data-table"
import useProductModal from "@/hooks/useProductmodal"
import AddNewProduct from "@/components/AddNewProduct"


async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "SP-1001",
      Price: 249,
      Quantity: 45,
      Brand: "LG",
      Name: "LG Neon R 375W",
      Type: "Monocrystalline",
      Efficiency: "21.4%",
      Warranty: "25 years"
    },
    {
      id: "SP-1002",
      Price: 189,
      Quantity: 60,
      Brand: "Canadian Solar",
      Name: "HiKu 400W",
      Type: "Polycrystalline",
      Efficiency: "19.8%",
      Warranty: "12 years"
    },
    {
      id: "SP-1003",
      Price: 319,
      Quantity: 30,
      Brand: "SunPower",
      Name: "Maxeon 3 400W",
      Type: "Monocrystalline",
      Efficiency: "22.6%",
      Warranty: "25 years"
    },
    {
      id: "SP-1004",
      Price: 175,
      Quantity: 80,
      Brand: "Trina Solar",
      Name: "Vertex S 450W",
      Type: "PERC",
      Efficiency: "20.3%",
      Warranty: "15 years"
    },
    {
      id: "SP-1005",
      Price: 199,
      Quantity: 50,
      Brand: "Jinko Solar",
      Name: "Tiger Pro 415W",
      Type: "Bifacial",
      Efficiency: "20.9%",
      Warranty: "12 years"
    },
    {
      id: "SP-1006",
      Price: 229,
      Quantity: 40,
      Brand: "REC",
      Name: "Alpha Pure 420W",
      Type: "HJT",
      Efficiency: "22.3%",
      Warranty: "20 years"
    },
    {
      id: "SP-1007",
      Price: 159,
      Quantity: 70,
      Brand: "Longi Solar",
      Name: "Hi-MO 4 390W",
      Type: "Monocrystalline",
      Efficiency: "20.1%",
      Warranty: "12 years"
    },
    {
      id: "SP-1008",
      Price: 279,
      Quantity: 25,
      Brand: "Panasonic",
      Name: "EverVolt 380W",
      Type: "HIT",
      Efficiency: "21.2%",
      Warranty: "25 years"
    },
    {
      id: "SP-1009",
      Price: 169,
      Quantity: 65,
      Brand: "Q Cells",
      Name: "Q.PEAK DUO 405W",
      Type: "PERC",
      Efficiency: "20.5%",
      Warranty: "12 years"
    },
    {
      id: "SP-1010",
      Price: 349,
      Quantity: 15,
      Brand: "Tesla",
      Name: "Solar Panel 425W",
      Type: "Monocrystalline",
      Efficiency: "22.1%",
      Warranty: "25 years"
    },
    {
      id: "INV-2001",
      Price: 1299,
      Quantity: 20,
      Brand: "SolarEdge",
      Name: "SE5000H Inverter",
      Type: "String Inverter",
      Efficiency: "5kW",
      Warranty: "12 years"
    },
    {
      id: "INV-2002",
      Price: 899,
      Quantity: 30,
      Brand: "Enphase",
      Name: "IQ7+ Microinverter",
      Type: "Microinverter",
      Efficiency: "290W",
      Warranty: "25 years"
    },
    {
      id: "BAT-3001",
      Price: 6999,
      Quantity: 8,
      Brand: "Tesla",
      Name: "Powerwall 2",
      Type: "Lithium-ion",
      Efficiency: "13.5kWh",
      Warranty: "10 years"
    },
    {
      id: "BAT-3002",
      Price: 3499,
      Quantity: 12,
      Brand: "LG Chem",
      Name: "RESU 10H",
      Type: "Lithium-ion",
      Efficiency: "9.8kWh",
      Warranty: "10 years"
    },
    {
      id: "MTK-4001",
      Price: 499,
      Quantity: 25,
      Brand: "IronRidge",
      Name: "X-Rail Mounting System",
      Type: "Roof Mount",
      Efficiency: "100%",
      Warranty: "All panels"
    }
  ]
}

export default async function page() {
  
  const data = await getData()

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewProduct />
     

      <DataTable columns={columns} data={data} />
    </div>
  )
}
