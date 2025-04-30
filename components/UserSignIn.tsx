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
import { signInAccount } from '@/lib/Appwrite/api';
import { toast } from "sonner"

type Props = {}

const formSchema = z.object({
  Email: z.string({required_error:'Email required'}).email('Please Enter a Valid Email'),
  Password: z.string({required_error:'Password is required'})
})

const UserSignIn = (props: Props) => {
  
  const router = useRouter()
  const [isLoading, setIsLoading] =  useState<boolean>(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Email: "",
      Password: "",
    },
  })
  
  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const session = await signInAccount(values.Email,values.Password)
    setIsLoading(false)
    if(!session.success){
    return toast(`${session.error}`)
    
    }
    router.push('/Dashboard')
    
    
  }
  return (
    <div className='w-full  p-12 '>

    <div className=' w-full flex flex-col items-start gap-y-[20px]  '>
 
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="Email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-sm'>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type='password'/>
              </FormControl>
              <FormMessage />

          
           
            </FormItem>
          )}
        />
        <Link href='/AccountRecovery' className='flex text-red-400 text-xs justify-end hover: cursor-pointer'>
        Forgot Password?</Link>
        <Button type="submit" className='w-full '>{isLoading ? 
        <div className='flex-center cursor-not-allowed'>  Logging In...</div>
          : 'Log In'} </Button>
      </form>
    </Form>
      </div>
      <div className='flex-col  lg:flex text-center text-sm text-neutral-600 p-3 items-center justify-center '>
        <p className='mr-1'>Don't have an account ?</p> 
      <Link href= '/Signup' className='text-blue text-small ml-5'>Create an account</Link>
      </div>

    
      
    </div>
    
  )
}

export default UserSignIn