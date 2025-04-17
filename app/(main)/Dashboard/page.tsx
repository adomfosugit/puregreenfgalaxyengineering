import DashboardContent from '@/components/DashboardContent'
import { getLoggedInUser } from '@/lib/Appwrite/api'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const user = await getLoggedInUser()

  return (
    <>
    
      <div className="flex-1 space-y-4 p-8 pt-6 mx-30">
      <DashboardContent userEmail={user.email} />
      </div>
    
  </>
  )
}

export default page