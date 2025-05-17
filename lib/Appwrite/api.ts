'use server'

import { Customer } from "@/app/(main)/Customers/page";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from "./Config";
import {InputFile} from 'node-appwrite/file'
import { redirect } from "next/navigation";
interface ProductFormValues {
  
  quantity: number; 
  width: number; 
  length: number;
  price: number; 
  brand: string; 
  description: string;
  userEmail: string
  category: string
  name:string;
  Watt:number;
  Voltage:number;
  imageSrc: string[];

}
export type NewUser = {
  Email : string;
  Password:string;
  Name:string;

}
// Authentication 
const {NEXT_DATABASE_ID,NEXT_INVOICE_COLLECTION_ID,NEXT_ADVERT_COLLECTION_ID,NEXT_EXPENSE_COLLECTION_ID, NEXT_ADVERTISEMENT_COLLECTION_ID,NEXT_SALES_COLLECTION_ID,NEXT_PURCHASE_COLLECTION_ID, NEXT_CUSTOMER_COLLECTION_ID, NEXT_USER_COLLECTION_ID,NEXT_PRODUCT_COLLECTION_ID,NEXT_BIDDER_COLLECTION_ID,NEXT_BUCKET_ID,NEXT_BUCKET_ID_DOCS} = process.env

export async function createSUserAccount(user:NewUser){ 

  try {
    const {account} = await createAdminClient()
    const promise = await account.create( ID.unique(), user.Email, user.Password,user.Name)
    const session = await account.createEmailPasswordSession(user.Email,user.Password);
    const cookieStore = await cookies()
  
    cookieStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    //return parseStringify(promise)
    return { success: true, data: promise };
  } catch (error) {
    console.log(error)
    //@ts-ignore
    return { success: false, error: error?.message || "An unknown error occurred" }; 
  }   
}

export async function signInAccount(Email: string, Password: string) {
  try {
    const { account } = await createAdminClient();
    const promise = await account.createEmailPasswordSession(Email, Password);

    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", promise.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return { success: true, data: promise };
  } catch (error) {
    //@ts-ignore
    console.log(error?.message);
    //@ts-ignore
    return { success: false, error: error?.message || "An unknown error occurred" };  // Explicitly return error
  }
}

export async function getLoggedInUser(){ 
  try {
    const {account} = await createSessionClient()
    const user =  await account.get()
    return parseStringify(user)
  } catch (error) {
    console.log(error)
  }   
}
export async function LogOutUser(){ 
  try {
    const {account} = await createSessionClient()
    const cookieStore = await cookies()
    cookieStore.delete('appwrite-session')
    await account.deleteSession(parseStringify('current'))
    
  } catch (error) {
    console.log(error)
  }   
}


export async function getProducts(){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
    [Query.limit(200)])
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getAdvertisement(){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_ADVERTISEMENT_COLLECTION_ID!,
    [Query.limit(200)])
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getAdvert(){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_ADVERT_COLLECTION_ID!,
    [Query.limit(200)])
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function deleteProduct(id:string){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.deleteDocument(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
     id)
      
    return ProductData
  } catch (error) {
    console.log(error)
  }
} 
export async function getProductbyID(id:string){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.getDocument(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
      id
    )
      
    return ProductData
  } catch (error) {
    console.log(error)
  }
} 
export async function updateProductByID(id: string, data: any) {
  try {
    const { database } = await createAdminClient();
    
    const updatedProduct = await database.updateDocument(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
      id,
      data
    );

    return updatedProduct;
  } catch (error) {
    console.log(error);
    throw error; // rethrow if you want to handle it in the page
  }
}
export async function updateAdvertisementByID(id: string, data: any) {
  try {
    const { database } = await createAdminClient();
    
    const updatedProduct = await database.updateDocument(
      NEXT_DATABASE_ID!,
      NEXT_ADVERTISEMENT_COLLECTION_ID!,
      id,
      data
    );

    return updatedProduct;
  } catch (error) {
    console.log(error);
    throw error; // rethrow if you want to handle it in the page
  }
}
export async function getSearchProducts(searchterm:string){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
      [Query.contains('Name', searchterm )  ])
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getSearchProductsAD(searchterm:string){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_ADVERTISEMENT_COLLECTION_ID!,
      [Query.contains('Name', searchterm )  ])
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getinitialProducts(){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
    [Query.limit(2)])
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getinitialProductsAD(){
  try {
    const { database } = await createAdminClient()
    const ProductData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_ADVERTISEMENT_COLLECTION_ID!,
    [Query.limit(10)])
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getCustomers(startDate, endDate){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_CUSTOMER_COLLECTION_ID!,
      [ 
        Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),           
        Query.limit(1000),
        Query.orderDesc('$createdAt'),
      ]  
    )
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getinitialCustomers(){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_CUSTOMER_COLLECTION_ID!,
      [Query.limit(4), Query.orderDesc('$createdAt') ])
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getSearchCustomers(searchterm:string){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_CUSTOMER_COLLECTION_ID!,
      [Query.contains('Name', searchterm )  ])
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getSales(startDate, endDate) {
  try {
    const { database } = await createAdminClient()

    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,
      [
        Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),
        Query.orderDesc('$createdAt'),           
         Query.limit(1000),
      ]
    )

    return SalesData.documents
  } catch (error) {
    console.error('Error fetching sales YTD:', error)
    return []
  }
}

export async function getSalesYTD1(date){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,
    [Query.greaterThan('$createdAt', date),
      Query.select(['Price']),  Query.limit(1000)
    ])
      
    return SalesData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getSalesYTD(startDate, endDate) {
  try {
    const { database } = await createAdminClient()

    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,
      [
        Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),           
        Query.select(['Price','$createdAt']),
        Query.orderDesc('$createdAt'),
        Query.limit(1000),
      ]
    )

    return SalesData.documents
  } catch (error) {
    console.error('Error fetching sales YTD:', error)
    return []
  }
}
export async function deleteSales(id:string) {
  try {
    const { database } = await createAdminClient()

    const SalesData = await database.deleteDocument(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,
     id
    )

    return SalesData
  } catch (error) {
    console.error('Error fetching sales YTD:', error)
    return []
  }
}
export async function getProductsYTD(){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
    [ 
      Query.select(['Price','Quantity']),  Query.limit(1000)])
      
    return SalesData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getPurchaseYTD(startDate,endDate){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PURCHASE_COLLECTION_ID!,
      [ Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),  
          Query.limit(100),
          Query.orderDesc('$createdAt'),
      ])
      
    return SalesData.total
  } catch (error) {
    console.log(error)
  }
} 
export async function getExpensesYTD(startDate, endDate){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_EXPENSE_COLLECTION_ID!,
      [ Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate), 
         Query.limit(100)
      ])
      
    return SalesData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function deleteExpense(id:string){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.deleteDocument(
      NEXT_DATABASE_ID!,
      NEXT_EXPENSE_COLLECTION_ID!,
      id)
      
    return SalesData
  } catch (error) {
    console.log(error)
  }
} 
export async function getPurchases(startDate,endDate){
  try {
    const { database } = await createAdminClient()
    const PurchaseData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PURCHASE_COLLECTION_ID!,
      [ Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),  
        Query.orderDesc('$createdAt'),
          Query.limit(100)
      ])
      
    return PurchaseData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function deletePurchases(id:string){
  try {
    const { database } = await createAdminClient()
    const PurchaseData = await database.deleteDocument(
      NEXT_DATABASE_ID!,
      NEXT_PURCHASE_COLLECTION_ID!,
     id)
      
    return PurchaseData
  } catch (error) {
    console.log(error)
  }
} 
export async function getProductId(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_PRODUCT_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 
export async function getProductIdAD(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_ADVERTISEMENT_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 
export async function getAdvertisementId(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_ADVERTISEMENT_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 
export async function getAdvertId(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_ADVERT_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 
export async function getSalesId(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_SALES_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 

export async function createSalesAndUpdateProduct1(data: {
  customerId: string;
  Tax:number;
  Transport:number
  Discount:number;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    
  }>;
}) {
  const { customerId, products, Tax, Discount, Transport} = data;

  try {
    const { database } = await createAdminClient();
    
    // Step 1: Validate all products and check quantities
    const productValidations = await Promise.all(
      products.map(async (item) => {
        const product = await getProductId(item.productId);
        if (!product) {
          return { valid: false, error: `Product ${item.productId} not found` };
        }
        if (product.Quantity < item.quantity) {
          return { 
            valid: false, 
            error: `Insufficient quantity for product ${product.Name}` 
          };
        }
        return { valid: true, product };
      })
    );

    // Check for any validation errors
    const validationError = productValidations.find(v => !v.valid);
    if (validationError) {
      return { success: false, error: validationError.error };
    }

    // Calculate total price (sum of all product prices * quantities)
    const totalPrice = products.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const totalPriceTax = totalPrice + totalPrice * (Tax / 100) 
    const totalPriceDiscounted = totalPriceTax - (totalPriceTax * (Discount / 100)) + Transport
        // Step 2: Create the sales document
    const salesResult = await uploadSales({
      Price: totalPriceDiscounted,
      Transport:Transport,
      Itemqty: [...products.map(item => item.quantity)],
      currentPrice:[...products.map(item => item.price)],
      Quantity: products.reduce((sum, item) => sum + item.quantity, 0),
      customerId,
      //@ts-ignore
      productId: [ ...products.map(item => item.productId) ],
      Tax: Tax,
      Discount: Discount
    
    });
    console.log(products.map(item => item.price))
    if (!salesResult?.success) {
      return { 
        success: false, 
        error: salesResult?.error || "Failed to create sales record" 
      };
    }

    // Step 3: Update all product quantities
    const updatePromises = products.map(item => {
      return database.updateDocument(
        NEXT_DATABASE_ID!,
        NEXT_PRODUCT_COLLECTION_ID!,
        item.productId,
        {
          Quantity: productValidations
            .find(v => v.valid && v.product?.$id === item.productId)
            ?.product?.Quantity! - item.quantity
        }
      );
    });

    const updatedProducts = await Promise.all(updatePromises);

    return { 
      success: true, 
      data: {
        sales: salesResult.data,
        products: parseStringify(updatedProducts)
      } 
    };
  } catch (error) {
    console.log(error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An error occurred while processing the sale." 
    };
  }
}
export async function createPurchaseAndUpdateProduct(data: salesOrder1) {
  const { Quantity, productId, uploader } = data;

  try {
    const { database } = await createAdminClient();

    // Step 1: Get the product using your existing function
    const product = await getProductId(productId);
    
    // Check if product exists
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const currentQuantity = product.Quantity;
    
// Step 2: Create the sales document using your existing function
//@ts-ignore
    const salesResult = await uploadPurchase({Quantity,productId,uploader});

    if (!salesResult?.success) {
      return { 
        success: false, 
        error: salesResult?.error || "Failed to create sales record" 
      };
    }

    // Step 3: Update the product quantity
    const updatedProduct = await database.updateDocument(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
      productId,
      {
        Quantity: currentQuantity + Quantity
      }
    );

    return { 
      success: true, 
      data: {
        purchase: salesResult.data,
        product: parseStringify(updatedProduct)
      } 
    };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { 
      success: false, 
      //@ts-ignore
      error: error?.message || "An error occurred while processing the sale." 
    };
  }
}
export async function uploadCustomer(data: Customer) {
  const {name,email, phone} = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const customerupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_CUSTOMER_COLLECTION_ID!,
      ID.unique(),
      {
        Name:name,
        Phone: phone,
        Email: email
      
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(customerupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}
type salesOrder1 = {
  Price:number;
  Quantity:number;
  customerId:string;
  productId:string;
  uploader:string
  Itemqty:number[]
  Discount:number
  Tax:number
  currentPrice:number[]
  Transport: number;
}
export async function uploadSales(data: salesOrder1) {
  const {Price, Quantity, customerId,productId,Itemqty, Tax, Discount,currentPrice, Transport} = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const customerupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,
      ID.unique(),
      {
        Price:Price,
        Quantity:Quantity,
        customer:customerId,
        currentPrice:currentPrice,
        product:productId,
        Itemqty: Itemqty,
        Tax:Tax,
        Discount:Discount,
        Transport:Transport,
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(customerupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}
export type Product1 = {
  $id: string;
  price: number;
  Brand:string;
  Name:string;
  quantity:number;

}

type InvoiceOrder1 = {
  Price:number;
  Quantity:number;
  customerId:string;
  product:Product1[];
  uploader:string
  Itemqty:number[],
  Transport:number,
  Tax:number,
  Discount:number,

}
export async function uploadInvoices(data: InvoiceOrder1) {
  const {Price, Quantity, customerId,product,Itemqty, Transport, Tax, Discount} = data;

  try {
    // Upload land
    const totalPrice = product.reduce((sum, item) => sum + (item.price * item.quantity),0);
    const totalPriceTax =  totalPrice + totalPrice * (Tax / 100) 
    const totalPriceDiscounted = totalPriceTax - (totalPriceTax * (Discount / 100)) + Transport;
    const { database } = await createAdminClient();
    const customerupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_INVOICE_COLLECTION_ID!,
      ID.unique(),
     
      {
        Price: totalPriceDiscounted,
        Itemqty: [...product.map(item => item.quantity)],
        currentPrice:[...product.map(item => item.price)],
        Quantity: product.reduce((sum, item) => sum + item.quantity, 0),
        customer:customerId,
        Transport:Transport,
        //@ts-ignore
        product: [ ...product.map(item => item.productId) ],
        Tax:Tax,
        Discount:Discount
      
      
    
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(customerupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}
type Expense1= {
  Electricity:number;
  Water:number;
  Tax:number;
  Transport:number;
  Salary:number;
  Internet:number;
  Other:number;
  Comment:string;
}
export async function uploadExpenses(data: Expense1) {
  const {Electricity, Water, Tax, Transport, Salary, Internet,Comment, Other} = data;

  try {
 
    const { database } = await createAdminClient();
    const customerupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_EXPENSE_COLLECTION_ID!,
      ID.unique(),
     
      {
        Electricity:Electricity,
        Water: Water,
        GRA_Tax:Tax,
        Transport: Transport,
        Salary:Salary,
        Internet:Internet,
        Comment:Comment,
        Other:Other

         
    
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(customerupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}
export async function getInvoice(startDate, endDate){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_INVOICE_COLLECTION_ID!,
      [ Query.greaterThanEqual('$createdAt', startDate), 
        Query.lessThanEqual('$createdAt', endDate),  
          Query.limit(100),
          Query.orderDesc('$createdAt'),
      ])
      
    return SalesData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function deleteInvoice(id:string){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.deleteDocument(
      NEXT_DATABASE_ID!,
      NEXT_INVOICE_COLLECTION_ID!,
     id)
      
    return SalesData
  } catch (error) {
    console.log(error)
  }
} 

export async function getInvoicesId(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
     NEXT_INVOICE_COLLECTION_ID!,
     id)
      
   return landData
  } catch (error) {
   console.log(error)
 }
} 
export async function uploadPurchase(data: salesOrder1) {
  const {Quantity,productId,uploader} = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const customerupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_PURCHASE_COLLECTION_ID!,
      ID.unique(),
      {
        Quantity:Quantity,
        Uploader: uploader,
        product:productId,
      
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(customerupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}


export async function uploadProduct(data: ProductFormValues) {
  const { category, price, description, quantity, brand, userEmail, name,width, length,imageSrc, Watt, Voltage} = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const landupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_PRODUCT_COLLECTION_ID!,
      ID.unique(),
      {
        Name:name,
        Brand: brand,
        Category: category,
        Quantity: quantity,
        Description: description,
        Price: price,
        Email: userEmail,
        Dimension_Length:length,
        Dimension_Width:width,
        ImageSrc:imageSrc,
        Wattage:Watt,
        Voltage:Voltage,
      
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(landupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}

type AddFormValues ={
    Name:string;
    Location: string;
    Status: 'Available' | 'Rented'
    category: 'Billboard' | 'Medians'
    Price: number;
    Quantity:number;


}

export async function uploadAdvertisement(data: AddFormValues) {
  const {  Name,Location,Status,category, Price, Quantity} = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const landupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_ADVERTISEMENT_COLLECTION_ID!,
      ID.unique(),
      {
       Name:Name,
       Location:Location,
       Status:Status,
       category:category,
       Price:Price,
       Quantity:Quantity,
      
      }
    );

    // Return success and data
    return { success: true, data: parseStringify(landupload) };
  } catch (error) {
    console.log(error);
    //@ts-ignore
    return { success: false, error: error?.message || "An error occurred while uploading the land." };
  }
}






export async function filePreviewer(fileId:number){
  try {
    const { Storage } = await createAdminClient();
    // Upload the file to Appwrite Storage
    const response = await Storage.getFilePreview(
      NEXT_BUCKET_ID!, // Your Appwrite bucket ID
      ID.unique(), // Generate a unique file ID
      fileId
    );
      return response
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
// Messaging Email
export async function sendTermsConditions( content:string , userId:string ){
  try {
    const { messages } = await createAdminClient()
    const termsMessage = await messages.createEmail(
      ID.unique(),
      'Investment Plan ',
      content,
      [],[userId],[],[],[],[], false,true
      
    )
    return termsMessage
  } catch (error) {
    
  }
}
// Recovery and Account Update
export async function createAccountRecovery(Email:string){ 
  try {
    const {account} = await createAdminClient()
    const promise = await account.createRecovery(Email , process.env.NEXT_PUBLIC_RECOVERY_URL!)
    return parseStringify(promise)
  } catch (error) {
    console.log(error)
  }   
}
export async function createAccountUpdate(ID:string, secret:string, password:string){ 
  try {
    const {account} = await createAdminClient()
    const promise = await account.updateRecovery(ID, secret, password)
    return parseStringify(promise)
  } catch (error) {
    console.log(error)
  }   
}
//Register Land 
export async function registerProduct(productimage: FormData) {
  try {
    const file = productimage.get('productimage') as File;

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const { Storage } = await createAdminClient();
    // Upload the file to Appwrite Storage
    const response = await Storage.createFile(
      NEXT_BUCKET_ID!, // Your Appwrite bucket ID
      ID.unique(), // Generate a unique file ID
      InputFile.fromBuffer(buffer, file.name) // Create InputFile from buffer
    );

    // Return the file URL
    return {
      url: `https://cloud.appwrite.io/v1/storage/buckets/${NEXT_BUCKET_ID}/files/${response.$id}/view?project=66cb7e28000134f29da2&mode=admin`,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
export async function createAdvertisementDeal(data: {
  CustomerName: string;
  PhoneNumber: string;
  AmountPaid: number;
  TenureStart: Date;
  TenureEnd: Date;
  DurationMonths: number;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
    location: string;
    totalPrice: number;
  }>;
}) {
  const { CustomerName, PhoneNumber, AmountPaid, TenureStart, TenureEnd, DurationMonths, products } = data;

  try {
    const { database } = await createAdminClient();
    
    // Step 1: Validate all products and check quantities
    const productValidations = await Promise.all(
      products.map(async (item) => {
        const product = await getProductIdAD(item.productId);
        if (!product) {
          return { valid: false, error: `Advertisement product ${item.productId} not found` };
        }
        if (product.Quantity < item.quantity) {
          return { 
            valid: false, 
            error: `Insufficient quantity for ${product.Location} ${product.Name}` 
          };
        }
        return { valid: true, product };
      })
    );

    // Check for any validation errors
    const validationError = productValidations.find(v => !v.valid);
    if (validationError) {
      return { success: false, error: validationError.error };
    }

    // Calculate total rental value
    const totalRentalValue = products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // Step 2: Create the advertisement document
    const advertisementResult = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_ADVERT_COLLECTION_ID!, // You'll need to define this
      ID.unique(),
      {
        CustomerName,
        PhoneNumber,
        AmountPaid,
        TotalValue: totalRentalValue,
        TenureStart: TenureStart.toISOString(),
        TenureEnd: TenureEnd.toISOString(),
        DurationMonths,
        Status: AmountPaid >= totalRentalValue ? 'Paid' : 'Partial',
        advertisement: products.map(item => ( item.productId ))} );

    if (!advertisementResult) {
      return { 
        success: false, 
        error: "Failed to create advertisement record" 
      };
    }

    // Step 3: Update all product quantities (marking them as rented out)
    const updatePromises = products.map(item => {
      return database.updateDocument(
        NEXT_DATABASE_ID!,
        NEXT_ADVERTISEMENT_COLLECTION_ID!,
        item.productId,
        {
          Quantity: productValidations
            .find(v => v.valid && v.product?.$id === item.productId)
            ?.product?.Quantity! - item.quantity,
          Status: 'Rented', 

        }
      );
    });

    await Promise.all(updatePromises);

    return { 
      success: true, 
      data: parseStringify(advertisementResult)
    };
  } catch (error) {
    console.error('Advertisement creation error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An error occurred while processing the advertisement deal." 
    };
  } 
}