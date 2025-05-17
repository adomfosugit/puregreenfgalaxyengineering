'use client'

import React from 'react'
import { Button } from './ui/button'

import useAdvertisementDeal from '@/hooks/useAdvetisementDeal'

type Props = {}

const AddNewAdvertisementDeal = (props: Props) => {
    const productmodal = useAdvertisementDeal()
  return (
    <Button className="w-[150px] " onClick={productmodal.onOpen}>Add New </Button>
  )
}

export default AddNewAdvertisementDeal