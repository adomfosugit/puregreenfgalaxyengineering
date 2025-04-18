"use client"; // This marks the component as client-side

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  $id: string;
  Name: string;
  Price: number;
  Description?: string;
  Brand: string;
}

interface Sale {
  $id: string;
  Price: number;
  Quantity: number;
  Itemqty: number[];
  product: Product[];
  customer: {
    Name: string;
    Email: string;
    Phone: string;
  };
  $createdAt: string;
  Discount?: number;
  Tax?: number;
}

type DocumentType = "invoice" | "salesReceipt";

interface SalesReceiptClientProps {
  sale: Sale; // The sale data passed from the server component
  type: DocumentType;
}

export default function SalesDocument({ sale, type }: SalesReceiptClientProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  
  // React to Print handler
  const reactToPrintFn = useReactToPrint({ contentRef });

  const date = new Date(sale.$createdAt);

  // Calculate order totals
  const subtotal = sale.product.reduce((sum, product, index) => {
    const quantity = sale.Itemqty[index] || sale.Quantity;
    return sum + product.Price * quantity;
  }, 0);

  const taxRate = (sale.Tax || 0) / 100;
  const tax = subtotal * taxRate;
  const discountRate = (sale.Discount || 0) / 100;
  const discount = subtotal * discountRate;
  const total = (subtotal + tax) - discount;

  const isInvoice = type === "invoice";
  const documentTitle = isInvoice ? "INVOICE" : "SALES RECEIPT";
  const idLabel = isInvoice ? "Invoice ID" : "Sales ID";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
     
      <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-md" ref={contentRef}>
        {/* Document Header */}
        <div className="text-center mb-8 justify-between flex flex-row gap-y-3 max-w-3xl mx-auto">
          <div>
            <p className="font-bold text-xl">PUREGREEN GALAXY ENGINEERING</p>
            <p className="text-start text-sm">East Legon Hills</p>
            <p className="text-start text-sm">Email:
              <Link href="PureGreen.eng@gmail.com" className="text-sm text-blue-600 ml-2">PureGreen.eng@gmail.com</Link>
            </p>
            <p className="text-start text-sm">Mobile No: 0540113443</p>
          </div>
          <div className="flex flex-col items-end">
            <Image src={'/PuregreenLogo.jpg'} width={100} height={100} alt='logo'/>
            <h1 className="text-sm font-bold mt-2">{documentTitle}</h1>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-8 p-4 ring-1 ring-primary rounded-lg text-sm flex flex-row max-w-2xl mx-auto justify-between">
          <div>
            <p className="mt-1"><p className="font-bold">Name/Company</p> {sale.customer.Name}</p>
            <p className="mt-1"><p className="font-bold">Email</p> {sale.customer.Email}</p>
            <p className="mt-1"><p className="font-bold">Contact</p> {sale.customer.Phone}</p>
          </div>
          <div>
            <p className="mt-1"><p className='font-bold'>Date </p>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</p>
            <p className="mt-1"><p className='font-bold'>Time </p>{date.getHours()}:{date.getMinutes().toString().padStart(2, '0')}</p>
            <p className="mt-1"><p className="font-bold">{idLabel}</p> {sale.$id}</p>
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
                {sale.product.map((product, index) => (
                  <tr key={product.$id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{product.Name}</div>
                      <div className="text-sm text-gray-500">
                        {product.Brand || 'No brand specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">GHC {product.Price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.Itemqty[index] || sale.Quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      GHC {(product.Price * (sale.Itemqty[index] || sale.Quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold">Subtotal:</span>
              <span>GHC {subtotal.toFixed(2)}</span>
            </div>
            
            {!isInvoice && discount > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Discount ({sale.Discount}%):</span>
                <span className="text-red-600">- GHC {discount.toFixed(2)}</span>
              </div>
            )}
            
            {!isInvoice && tax > 0 && (
              <div className="flex justify-between py-2 border-b">
                <span className="font-semibold">Tax ({sale.Tax}%):</span>
                <span>GHC {tax.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total:</span>
              <span>GHC {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-4 border-t text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-2">If you have any questions, please contact puregreen.eng@gmail.com</p>
          <button 
            className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={() => reactToPrintFn()}
          >
            Print {isInvoice ? "Invoice" : "Receipt"}
          </button>
        </div>
      </div>
    </div>
  );
}