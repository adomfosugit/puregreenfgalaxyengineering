'use client'
import Image from 'next/image'
import React from 'react'
import {z} from 'zod'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccountUpdate } from '@/lib/Appwrite/api';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner';
type Props = {}

const formSchema = z.object({
 
  Password: z.string({required_error:'Password is required'}),
  Password2: z.string({required_error:'Password is required'})
}).superRefine(({ Password2, Password }, ctx) => {
    if (Password2 !== Password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['Password2']
      });
    }
  });

const page = (props: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const secret = searchParams.get('secret')
  const isLoading = false
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Password: "",
      Password2: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
        {/*@ts-ignore */}
      const update = await createAccountUpdate( userId , secret , values.Password2)
      console.log(userId)
    
    if(!update){
    return toast('Password Reset Failed. Please try again')
    }
    router.push('/')
  }
  return (
    <div className='flex items-center justify-center p-5 '>
         <div className=''>

    <div className=' w-full flex flex-col items-start gap-y-[20px]  '>
    <div className="justify-center mx-auto">
        <Image src={`/PuregreenLogo.jpg`} height={100} width={100} alt="logo"/>
      </div>
    <div className="mt-3">
      <h1 className='text-2xl  text-center text-neutral'>Inventory Management System</h1>
    </div>


      <h1 className='text-primary font-bold'>Reset Password </h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type='password'  />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Password2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} type='password'/>
              </FormControl>
              <FormMessage />
           
            </FormItem>
          )}
        />
        <Button type="submit" className='w-full'>Submit </Button>
      </form>
    </Form>
    </div>
    </div>
    </div>
   
  )
}

export default page