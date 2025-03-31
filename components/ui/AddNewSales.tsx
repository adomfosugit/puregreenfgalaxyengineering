'use client'
import React from 'react'
import useSalesModal from '@/hooks/useSalesModal'
import { Button } from './button'

type Props = {}

const AddNewSales = (props: Props) => {
    const salemodal = useSalesModal()
  return (
    <Button className="w-[150px] " onClick={salemodal.onOpen}>Add Sales </Button>
  )
}

export default AddNewSales