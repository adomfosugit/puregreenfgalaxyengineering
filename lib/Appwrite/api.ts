'use server'

import { createSessionClient,createAdminClient } from "./Config";
import {ID, Query} from 'node-appwrite'
import {InputFile} from 'node-appwrite/file'
import { cookies, headers } from "next/headers";
import { parseStringify } from "@/lib/utils";
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

}
export type NewUser = {
  Email : string;
  Password:string;
  Name:string;

}
// Authentication 
const {NEXT_DATABASE_ID,  NEXT_SERVICEPROVIDER_COLLECTION_ID, NEXT_USER_COLLECTION_ID,NEXT_LAND_COLLECTION_ID,NEXT_BIDDER_COLLECTION_ID,NEXT_BUCKET_ID,NEXT_BUCKET_ID_DOCS} = process.env

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


export async function getLands(){
  try {
    const { database } = await createAdminClient()
    const landData = await database.listDocuments(
      NEXT_DATABASE_ID!,
      NEXT_LAND_COLLECTION_ID!,)
      
    return landData.documents
  } catch (error) {
    console.log(error)
  }
} 
export async function getLandById(id:string){
  try {
    const { database } = await createAdminClient()
    const landData = await database.getDocument(
      NEXT_DATABASE_ID!,
      NEXT_LAND_COLLECTION_ID!,
      id)
      
    return landData
  } catch (error) {
    console.log(error)
  }
} 


export async function uploadProduct(data: ProductFormValues) {
  const { category, price, description, quantity, brand, userEmail, name,width, length } = data;

  try {
    // Upload land
    const { database } = await createAdminClient();
    const landupload = await database.createDocument(
      NEXT_DATABASE_ID!,
      NEXT_LAND_COLLECTION_ID!,
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