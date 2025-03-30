'use client'
import useProductModal from '@/hooks/useProductmodal'
import React from 'react'
import { Button } from './ui/button'

type Props = {}

const AddNewProduct = (props: Props) => {
    const productmodal = useProductModal()
  return (
    <Button className="w-[150px] " onClick={productmodal.onOpen}>Add New </Button>
  )
}

export default AddNewProduct