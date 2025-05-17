import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import { getCustomers, getLoggedInUser, getProducts } from "@/lib/Appwrite/api";
import { redirect } from "next/navigation";
import SalesModal from "@/components/Modal/SaleModal";
import ProductModal from "@/components/Modal/ProductModal";
import CustomerModal from "@/components/Modal/CustomerModal";
import PurchaseModal from "@/components/Modal/PurchaseModal";
import { Customer } from "./Customers/page";
import { Product } from "./Product/Column";
import InvoiceModal from "@/components/Modal/InvoiceModal";
import ExpenseModal from "@/components/Modal/ExpenseModal";
import Advertisement from "@/components/Modal/Advertisement";
import Admanager from "@/components/Modal/Admanager";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PureGreen Galaxy Engineering-Sign Up ",
  description: "Inventory Management System",
};

export const dynamic = "force-dynamic";
export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) 
{
 
  const getUser = await getLoggedInUser()


  //@ts-ignore
  const products:Product[] = await getProducts()
  if(!getUser){
      redirect('/')
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <Toaster position="top-center"/>
        <ProductModal />
        {/*@ts-ignore*/}
        <SalesModal /> 
        <Advertisement />
        <Admanager />
         {/*@ts-ignore*/}
       <InvoiceModal  />
        <CustomerModal />
        {/* @ts-ignore */}
        <PurchaseModal products={products}  />
        <ExpenseModal />
        {children}

      </body>
    </html>
  );
}
