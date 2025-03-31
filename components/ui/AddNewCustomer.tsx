'use client'
import React from 'react'
import { Button } from './button'
import useCustomerModal from '@/hooks/useCustomerModal'

type Props = {}

const AddNewCustomer = (props: Props) => {
    const customermodal = useCustomerModal()
  return (
    <Button className="w-[150px] " onClick={customermodal.onOpen}>Add Customer </Button>
  )
}

export default AddNewCustomer