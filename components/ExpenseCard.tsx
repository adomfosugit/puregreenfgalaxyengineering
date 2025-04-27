import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddNewExpense from './AddNewExpense';

type Expense = {
  Electricity: number;
  Water: number;
  GRA_Tax: number;
  Salary: number;
  Transport: number;
  Internet: number;
  Other:number;
  Comment: string;
  $createdAt: string;
};

type Props = {
  expenses: Expense[];
};

const calculateTotalExpenses = (expenses: Expense[]) => {
  let totalElectricity = 0;
  let totalWater = 0;
  let totalInternet = 0;
  let totalTax = 0;
  let totalSalary = 0;
  let totalOther = 0;

  expenses.forEach((item) => {
    totalElectricity += Number(item.Electricity) || 0;
    totalWater += Number(item.Water) || 0;
    totalInternet += Number(item.Internet) || 0;
    totalTax += Number(item.GRA_Tax) || 0;
    totalSalary += Number(item.Salary) || 0;
    totalOther += Number(item.Other) || 0;
  });

  const grandTotal =
    totalElectricity + totalWater + totalInternet + totalTax + totalSalary+totalOther;

  return {
    totalElectricity,
    totalWater,
    totalInternet,
    totalTax,
    totalSalary,
    totalOther,
    grandTotal,
  };
};

const ExpenseCard = ({ expenses }: Props) => {
  const expenseTotals = calculateTotalExpenses(expenses);

  return (
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
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Electricity
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Water
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internet
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tax
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Other
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.length > 0 ? (
                expenses.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      {new Date(item.$createdAt).toLocaleDateString('en-GH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="text-center">{item.Electricity}</td>
                    <td className="text-center">{item.Water}</td>
                    <td className="text-center">{item.Internet}</td>
                    <td className="text-center">{item.GRA_Tax}</td>
                    <td className="text-center">{item.Salary}</td>
                    <td className="text-center">{item.Other}</td>
                    <td className="text-center">{item.Comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No expenses
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100">
                <td className="px-4 py-2 text-sm font-bold text-center">
                  Total
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalElectricity}
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalWater}
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalInternet}
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalTax}
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalSalary}
                </td>
                <td className="px-4 py-2 text-sm font-bold text-center">
                  {expenseTotals.totalOther}
                </td>
              </tr>
              <tr>
                <td colSpan={6} className="text-right px-4 py-2 font-semibold">
                  Grand Total:{' '}
                  {new Intl.NumberFormat('en-GH', {
                    style: 'currency',
                    currency: 'GHS',
                  }).format(expenseTotals.grandTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
