'use client'
import React from 'react'
import { Button } from './ui/button'
import useAdvertisement from '@/hooks/useAdvertisement'

type Props = {}

const AddNewAdvertisement = (props: Props) => {
    const productmodal = useAdvertisement()
  return (
    <Button className="w-[150px] " onClick={productmodal.onOpen}>Add New </Button>
  )
}

export default AddNewAdvertisement