'use server'

import { Customer } from "@/app/(main)/Customers/page";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { ID } from 'node-appwrite';
import { createAdminClient, createSessionClient } from "./Config";
import { SalesOrder } from "@/app/(main)/Sales/page";
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

}
export type NewUser = {
  Email : string;
  Password:string;
  Name:string;

}
// Authentication 
const {NEXT_DATABASE_ID, NEXT_SALES_COLLECTION_ID,NEXT_PURCHASE_COLLECTION_ID, NEXT_CUSTOMER_COLLECTION_ID, NEXT_USER_COLLECTION_ID,NEXT_PRODUCT_COLLECTION_ID,NEXT_BIDDER_COLLECTION_ID,NEXT_BUCKET_ID,NEXT_BUCKET_ID_DOCS} = process.env

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
      NEXT_PRODUCT_COLLECTION_ID!,)
      
    return ProductData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getCustomers(){
  try {
    const { database } = await createAdminClient()
    const CustomerData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_CUSTOMER_COLLECTION_ID!,)
      
    return CustomerData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getSales(){
  try {
    const { database } = await createAdminClient()
    const SalesData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_SALES_COLLECTION_ID!,)
      
    return SalesData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getPurchases(){
  try {
    const { database } = await createAdminClient()
    const PurchaseData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_PURCHASE_COLLECTION_ID!,)
      
    return PurchaseData.documents
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

export async function createSalesAndUpdateProduct(data: salesOrder1) {
  const { Price, Quantity, customerId, productId, uploader } = data;

  try {
    const { database } = await createAdminClient();

    // Step 1: Get the product using your existing function
    const product = await getProductId(productId);
    
    // Check if product exists
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    const currentQuantity = product.Quantity;
    
    // Check if sufficient quantity is available
    if (currentQuantity < Quantity) {
      return { success: false, error: "Insufficient product quantity" };
    }

    // Step 2: Create the sales document using your existing function
    const salesResult = await uploadSales({
      Price,
      Quantity,
      customerId,
      productId,
      uploader
    });

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
        Quantity: currentQuantity - Quantity
      }
    );

    return { 
      success: true, 
      data: {
        sales: salesResult.data,
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
}
export async function uploadSales(data: salesOrder1) {
  const {Price, Quantity, customerId,productId} = data;

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
  const { category, price, description, quantity, brand, userEmail, name,width, length } = data;

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
        Dimension_Width:width
      
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