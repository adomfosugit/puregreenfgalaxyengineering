import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";
import { getLoggedInUser } from "@/lib/Appwrite/api";
import { redirect } from "next/navigation";
import SalesModal from "@/components/Modal/SaleModal";
import ProductModal from "@/components/Modal/ProductModal";
import CustomerModal from "@/components/Modal/CustomerModal";
import PurchaseModal from "@/components/Modal/PurchaseModal";

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
  if(!getUser){
      redirect('/')
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <Toaster/>
        <ProductModal />
        <SalesModal />
        <CustomerModal />
        <PurchaseModal />
        {children}

      </body>
    </html>
  );
}
