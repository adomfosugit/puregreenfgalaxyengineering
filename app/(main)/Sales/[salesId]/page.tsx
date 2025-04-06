import Image from "next/image";
import Link from "next/link";


interface Product {
  $id: string;
  Name: string;
  Price: number;
  Description?: string;
}

interface Sale {
  $id: string;
  Price: number;
  Quantity: number;
  Itemqty: number[];
  product: string[];
  customer: string;
  $createdAt: string;
}

export default function SalesReceipt() {
  // Dummy data - replace with your actual data structure
  const dummyProducts: Product[] = [
    {
      $id: 'prod1',
      Name: 'Premium Widget',
      Price: 29.99,
      Description: 'High-quality widget for all your needs'
    },
    {
      $id: 'prod2',
      Name: 'Basic Gadget',
      Price: 12.50,
      Description: 'Essential gadget for everyday use'
    },
    {
      $id: 'prod3',
      Name: 'Deluxe Accessory',
      Price: 45.75,
      Description: 'Luxury accessory for premium experience'
    }
  ];

  const dummySale: Sale = {
    $id: 'sale_12345',
    Price: 88.24, // This will be recalculated from products
    Quantity: 5, // Total quantity
    Itemqty: [2, 1, 2], // Quantities for each product
    product: ['prod1', 'prod2', 'prod3'],
    customer: 'cust_67890',
    $createdAt: new Date().toISOString()
  };

  // Calculate product details
  const productDetails = dummyProducts.map((product, index) => ({
    name: product.Name,
    price: product.Price,
    quantity: dummySale.Itemqty[index],
    subtotal: product.Price * dummySale.Itemqty[index]
  }));

  // Calculate totals
  const subtotal = productDetails.reduce((sum, item) => sum + item.subtotal, 0);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        {/* Receipt Header */}
        <div className="text-center mb-8 justify-between flex flex-row gap-y-3 max-w-3xl mx-auto">
          <div >
            <p className="font-bold text-xl">PUREGREEN GALAXY ENGINEERING</p>
            <p className="text-start text-sm">East Legon Hills</p>
            <p className="text-start text-sm">Email:
              <Link href="PureGreen.eng@gmail.com" className="text-sm text-blue-600 ml-2">PureGreen.eng@gmail.com</Link>
            </p>
            <p className="text-start text-sm">Mobile No:  {' '} 0540113443 </p>
          </div>
          <div>
            <Image src={'/PuregreenLogo.jpg'} width={100} height={100} alt='logo'/>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-sm flex flex-row max-w-2xl mx-auto justify-between">
        <div>
          <p className="mt-1">Name/Company: John Doe</p>
          <p className="mt-1">Email: john.doe@example.com</p>
          <p className="mt-1">Contact: 0556840595</p>

        </div>
        <div>

          <p className="mt-1">PaymentDate: 27.05.2025</p>
          <p className="mt-1">Sales ID: 77900hgsh6789</p>
        </div>
        </div>

        {/* Products Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {dummyProducts[index].Description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold">Subtotal:</span>
              <span>GHC{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold">Tax (8%):</span>
              <span>GHC{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span>GHC{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-2">If you have any questions, please contact puregreen.eng@gmail.com</p>
          <button 
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}