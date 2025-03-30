import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AuthDetails  {
    name:string,
}

const Auth:React.FC<AuthDetails> = ({name})=> {
  return (
    <div className='bg-slate p-3 rounded-full w-8 h-8 ring-2 ring-primary items-center justify-center flex space-x-4  '>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{name.charAt(0).toUpperCase()}</TooltipTrigger>
            <TooltipContent>
            <h5 className='text-white text-sm'>{name}</h5>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
    </div>
  )
}

export default Auth