import { CalendarDatePicker } from '@/components/CalendarDatePicker'
import { Overview } from '@/components/Overview'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <>
    
      <div className="flex-1 space-y-4 p-8 pt-6">
          <CalendarDatePicker />  
        <Overview />
      
         
          
      </div>
    
  </>
  )
}

export default page