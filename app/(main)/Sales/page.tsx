
import AddNewSales from "@/components/ui/AddNewSales";
import { columns } from "./Column";
import { DataTable } from "./data-table"

export type SalesOrder = {
  orderId: string;
  orderDate: string;
  customer: {
    name: string;
    email: string;
    contact: string;
  };
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  pricingSummary: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  notes?: string; // Optional field
};


async function getData(): Promise<SalesOrder[]> {
  // Fetch data from your API here.
  return[
  {
    orderId: "SO-2023-1001",
    orderDate: "2023-10-01",
    customer: {
      name: "EcoHome Installations",
      email: "sales@ecohome.com",
      contact: "+1 (555) 123-4567"
    },
    items: [
      {
        productId: "SP-1001",
        name: "LG Neon R 375W",
        brand: "LG",
        quantity: 20,
        unitPrice: 249,
        lineTotal: 4980
      },
      {
        productId: "INV-2002",
        name: "Enphase IQ7+ Microinverter",
        brand: "Enphase",
        quantity: 20,
        unitPrice: 899,
        lineTotal: 17980
      }
    ],
    pricingSummary: {
      subtotal: 22960,
      discount: 1148, // 5% bulk discount
      shipping: 350,
      tax: 1722,
      total: 23884
    },
    notes: "Deliver to warehouse by Oct 10"
  },
  {
    orderId: "SO-2023-1002",
    orderDate: "2023-10-05",
    customer: {
      name: "Solar Solutions Inc.",
      email: "procurement@solarsolutions.com",
      contact: "+1 (555) 987-6543"
    },
    items: [
      {
        productId: "SP-1004",
        name: "Trina Solar Vertex S 450W",
        brand: "Trina Solar",
        quantity: 30,
        unitPrice: 175,
        lineTotal: 5250
      },
      {
        productId: "MTK-4001",
        name: "IronRidge X-Rail Mounting System",
        brand: "IronRidge",
        quantity: 2,
        unitPrice: 499,
        lineTotal: 998
      }
    ],
    pricingSummary: {
      subtotal: 6248,
      discount: 312.4, // 5% discount
      shipping: 275,
      tax: 468.6,
      total: 6679.2
    }
  },
  {
    orderId: "SO-2023-1003",
    orderDate: "2023-10-08",
    customer: {
      name: "John & Sarah Thompson",
      email: "thompson.family@gmail.com",
      contact: "+1 (555) 456-7890"
    },
    items: [
      {
        productId: "SP-1008",
        name: "Panasonic EverVolt 380W",
        brand: "Panasonic",
        quantity: 12,
        unitPrice: 279,
        lineTotal: 3348
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 1,
        unitPrice: 1299,
        lineTotal: 1299
      }
    ],
    pricingSummary: {
      subtotal: 4647,
      discount: 0, // No discount (residential)
      shipping: 150,
      tax: 348.53,
      total: 5145.53
    },
    notes: "Residential rooftop installation"
  },
  {
    orderId: "SO-2023-1004",
    orderDate: "2023-10-12",
    customer: {
      name: "Green Energy Co-op",
      email: "orders@greencoop.org",
      contact: "+1 (555) 234-5678"
    },
    items: [
      {
        productId: "SP-1007",
        name: "Longi Solar Hi-MO 4 390W",
        brand: "Longi Solar",
        quantity: 50,
        unitPrice: 159,
        lineTotal: 7950
      },
      {
        productId: "BAT-3001",
        name: "Tesla Powerwall 2",
        brand: "Tesla",
        quantity: 3,
        unitPrice: 6999,
        lineTotal: 20997
      }
    ],
    pricingSummary: {
      subtotal: 28947,
      discount: 2894.7, // 10% volume discount
      shipping: 600,
      tax: 2171.03,
      total: 28823.33
    }
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  }, {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
  {
    orderId: "SO-2023-1005",
    orderDate: "2023-10-14",
    customer: {
      name: "Sunshine Farms",
      email: "manager@sunshinefarms.com",
      contact: "+1 (555) 345-6789"
    },
    items: [
      {
        productId: "SP-1002",
        name: "Canadian Solar HiKu 400W",
        brand: "Canadian Solar",
        quantity: 80,
        unitPrice: 189,
        lineTotal: 15120
      },
      {
        productId: "INV-2001",
        name: "SolarEdge SE5000H Inverter",
        brand: "SolarEdge",
        quantity: 4,
        unitPrice: 1299,
        lineTotal: 5196
      }
    ],
    pricingSummary: {
      subtotal: 20316,
      discount: 2031.6, // 10% agricultural discount
      shipping: 450,
      tax: 1523.7,
      total: 20258.1
    },
    notes: "For barn roof installation - heavy-duty mounts required"
  },
]
}

export default async function page() {
  
  const data = await getData()

  return (
    <div className="container mx-auto py-10 flex flex-col gap-y-2">
      <AddNewSales /> 
     

      <DataTable columns={columns} data={data} />
    </div>
  )
}
