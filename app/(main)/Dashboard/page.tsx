import { CalendarDatePicker } from '@/components/CalendarDatePicker'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getLoggedInUser, getProductsYTD, getPurchaseYTD, getSalesYTD } from '@/lib/Appwrite/api'
import Link from 'next/link'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const user = await getLoggedInUser()
  const userEmail = user.email
  console.log(userEmail)
  const allowedEmails = [
    'adomfosugit@gmail.com'
  ];

  // Check if current user's email is in the allowed list
  const isAuthorized = allowedEmails.includes(userEmail);
  
  const currentYear = new Date().getFullYear()
  const firstDayOfYear = new Date(currentYear, 0, 1) // January 1st of current year
  
  // Fetch YTD sales data
  const salesYTD = await getSalesYTD(firstDayOfYear)
  const totalRevenue = salesYTD?.reduce((sum, sale) => sum + sale.Price, 0) || 0
  const numberOfSales = salesYTD?.length || 0

  // Fetch products data and calculate total product value
  const productsYTD = await getProductsYTD()
  const totalProductValue = productsYTD?.reduce((sum, product) => {
    const price = product.Price || 0
    const quantity = product.Quantity || 0
    return sum + (price * quantity)
  }, 0) || 0
  const restock = await getPurchaseYTD(firstDayOfYear)

  // Format the amounts as currency
  const formattedTotal = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(totalRevenue)

  const formattedProductValue = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(totalProductValue)

  return (
    <>
    
      <div className="flex-1 space-y-4 p-8 pt-6">
     
     
     
          <CalendarDatePicker />  

          <div className="space-y-4">
         
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formattedTotal}</div>
                </CardContent>
                <Link href={'/Sales'}>
                
                <p className='text-sm text-primary font-medium text-center justify-center'>{numberOfSales} sales </p>
                </Link>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Product Value
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formattedProductValue}</div>
                  
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Restock
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{restock} Products</div>
                  
                </CardContent>
              </Card>
             
            </div>
            {isAuthorized && (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        Monthly Expenses
      </CardTitle>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (GHS)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Electricity */}
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Electricity</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">500</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
            {/* Water */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Water</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">250</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
            {/* Internet */}
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Internet</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">300</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
            {/* GRA Tax */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">GRA Tax</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">1200</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
            {/* Transport */}
            <tr>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Transport</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">400</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
            {/* Salary */}
            <tr className="bg-gray-50">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Salary</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">5000</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">June 2023</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">Total</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">7650</td>
              <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </CardContent>
  </Card>
)}
       </div>
      </div>
    
  </>
  )
}

export default page