import AddNewExpense from '@/components/AddNewExpense'
import { CalendarDatePicker } from '@/components/CalendarDatePicker'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getExpensesYTD, getLoggedInUser, getProductsYTD, getPurchaseYTD, getSalesYTD } from '@/lib/Appwrite/api'
import Link from 'next/link'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const user = await getLoggedInUser()
  const userEmail = user.email
  console.log(userEmail)
  const allowedEmails = [
    'adomfosugit@gmail.com',
    'niimartey3160@gmail.com',
    'manugideon@gmail.com',
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
  const expenses = await getExpensesYTD(firstDayOfYear)
  console.log(expenses)

  // Format the amounts as currency
  const formattedTotal = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(totalRevenue)

  const formattedProductValue = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(totalProductValue)


  //Expenses
  const calculateTotalExpenses = (expenses: any[]) => {
    let totalElectricity = 0;
    let totalWater = 0;
    let totalInternet = 0;
    let totalTax = 0;
    let totalSalary = 0;
  
    expenses.forEach((item) => {
      totalElectricity += Number(item.Electricity) || 0;
      totalWater += Number(item.Water) || 0;
      totalInternet += Number(item.Internet) || 0;
      totalTax += Number(item.GRA_Tax) || 0;
      totalSalary += Number(item.Salary) || 0;
    });
  
    const grandTotal = totalElectricity + totalWater + totalInternet + totalTax + totalSalary;
  
    return {
      totalElectricity,
      totalWater,
      totalInternet,
      totalTax,
      totalSalary,
      grandTotal
    };
  };
  
  {/*@ts-ignore */}
  const expenseTotals = expenses?.length > 0 ? calculateTotalExpenses(expenses) : null;
  return (
    <>
    
      <div className="flex-1 space-y-4 p-8 pt-6 mx-30">
     
     
          <div className=' flex justify-between'>

          <CalendarDatePicker />  
          <CalendarDatePicker />  
          </div>

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
      <CardTitle className="text-sm font-medium flex flex-row justify-between">
 
        <AddNewExpense />
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
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Electricity</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Water</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Internet</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">

            {/*@ts-ignore */}
                {expenses.length > 0 ? expenses.map((item) => (
                    <tr >
                     
                     <td className='flex text-center justify-center'>
                {new Date(item.$createdAt).toLocaleDateString('en-GH', {
               year: 'numeric',
               month: 'short',
              day: 'numeric'
                 })}
                  </td>
                      <td className=' text-center justify-center'>{item.Electricity}</td>
                      <td className='text-center justify-center'>{item.Water}</td>
                      <td className=' text-center justify-center'>{item.Internet}</td>
                      <td className=' text-center justify-center'>{item.GRA_Tax}</td>
                      <td className='text-center justify-center'>{item.Salary}</td>
                    </tr>


                  ))
                
                
                :<p>No expenses</p>}
        
          </tbody>
         
<tfoot>
  <tr className="bg-gray-100">
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">Total</td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? (expenseTotals.totalElectricity) : '0'}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? (expenseTotals.totalWater) : '0'}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? (expenseTotals.totalInternet) : '0'}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? (expenseTotals.totalTax) : '0'}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? (expenseTotals.totalSalary) : '0'}
    </td>
    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900 text-center justify-center">
      {expenseTotals ? new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(expenseTotals.grandTotal) : '0'}
    </td>
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