'use client'
import React from 'react'
import { Button } from './button'
import useInvoiceModal from '@/hooks/useInvoicemodal'

type Props = {}

const AddNewInvoice = (props: Props) => {
    const invoicemodal = useInvoiceModal()
  return (
    <Button className="w-[150px] " onClick={invoicemodal.onOpen}>Add Invoice</Button>
  )
}

export default AddNewInvoice