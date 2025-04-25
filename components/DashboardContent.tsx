'use client'

import {  useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

import {
  getExpensesYTD,
  getProductsYTD,
  getPurchaseYTD,
  getSalesYTD,
  Product1,
} from '@/lib/Appwrite/api'

import DashBoardCards from './DashBoardCards'
import ExpenseCard from './ExpenseCard'
import { DatePickerWithRange } from './CalendarDatePicker'
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import Overview from './Overview'


const DashboardContent = ({ userEmail }: { userEmail: string }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st of current month
    to: new Date(), // today
  })



const chartConfig = {Price: {label: "Price",color: "green", },

} satisfies ChartConfig

  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<Product1[]>([])
  const [restocks, setRestocks] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])

  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalProductValue, setTotalProductValue] = useState(0)

  const allowedEmails = ['adomfosugit@gmail.com', 'niimartey3160@gmail.com', 'manugideon@gmail.com']
  const isAuthorized = allowedEmails.includes(userEmail)

  useEffect(() => {
    const fetchData = async () => {
      const startDate = dateRange?.from
      const endDate = dateRange?.to

      if (!startDate || !endDate) return

      const salesData = await getSalesYTD(startDate, endDate)
      const productData = await getProductsYTD()
      const restockData = await getPurchaseYTD(startDate, endDate)
      const expenseData = await getExpensesYTD(startDate, endDate)

      setSales(salesData)
      setProducts(productData)
      setRestocks(restockData)
      setExpenses(expenseData)

      const totalRevenue = salesData?.reduce((sum, sale) => sum + (sale?.Price || 0), 0) || 0
      setTotalRevenue(totalRevenue)

      const totalValue = productData?.reduce((sum, product) => {
        const price = product?.Price || 0
        const quantity = product?.Quantity || 0
        return sum + price * quantity
      }, 0) || 0
      setTotalProductValue(totalValue)
    }

    fetchData()
  }, [dateRange])
  console.log(sales)

  const formattedTotal = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(totalRevenue)

  const formattedProductValue = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(totalProductValue)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
      </div>


      <DashBoardCards
        formattedProductValue={formattedProductValue}
        formattedTotal={formattedTotal}
        restock={restocks}
        numberOfSales={sales.length}
      />
     
      <div>
          {/*Add Analytics  Chart */}
          <Overview chartData = {sales}/>
      </div>

      {isAuthorized && <ExpenseCard expenses={expenses} />}
    </div>
  )
}

export default DashboardContent