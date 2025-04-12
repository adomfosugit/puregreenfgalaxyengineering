'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { createAccountRecovery } from '@/lib/Appwrite/api';
import { toast, Toaster } from 'sonner';
type Props = {}

const formSchema = z.object({
  Email: z.string({required_error:'Email required'}).email('Please Enter a Valid Email'),

})

const AccountRecovery = (props: Props) => {
  
  const router = useRouter()
  const [isLoading, setIsLoading] =  useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
    
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
   createAccountRecovery(values.Email)
   toast('A reset link has been sent to your email')
    
  }
  return (
    <div className='w-full p-12 '>

    <div className=' w-full flex flex-col items-start gap-y-[20px]  '>
 
      <div>
        <h1 className='text-xl font-semibold'>Reset Your Password</h1>
        <h1 className='text-sm text-zinc-500'>please enter your email a reset link will be sent to you</h1>
      </div>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
    
     
        <Button type="submit" className='w-full'> 
        Submit </Button>
      </form>
    </Form>
      </div>
 

      </div>
    
      

    
  )
}

export default AccountRecovery;