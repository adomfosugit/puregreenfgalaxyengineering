import AccountRecovery from '@/components/AccountRecovery'
import Image from 'next/image'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <div className='flex flex-col items-center justify-center mx-auto max-w-4xl'>
          <div className="justify-center mx-auto">
        <Image src={`/PuregreenLogo.jpg`} height={100} width={100} alt="logo"/>
      </div>
    <div className="mt-3">
      <h1 className='text-2xl  text-center text-neutral'>Inventory Management System</h1>
    </div>
        <AccountRecovery />
    </div>
  )
}

export default page