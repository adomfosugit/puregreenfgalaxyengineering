'use client'
import React from 'react'
import { Button } from './button'
import usePurchaseModal from '@/hooks/usePurchaseModal'

type Props = {}

const AddNewPurchase = (props: Props) => {
    const purchasemodal = usePurchaseModal()
  return (
    <Button className="w-[150px] " onClick={purchasemodal.onOpen}>Add Stock </Button>
  )
}

export default AddNewPurchase