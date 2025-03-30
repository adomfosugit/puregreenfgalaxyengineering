import React from 'react'

interface AuthDetails  {
    name:string,
}

const Auth:React.FC<AuthDetails> = ({name})=> {
  return (
    <div className='bg-slate p-3 rounded-xl ring-1 ring-primary items-center justify-center flex space-x-4  '>
        <h5 className='text-gray-700 text-sm'>{name}</h5>
    </div>
  )
}

export default Auth