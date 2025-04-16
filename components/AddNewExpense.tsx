'use client'

import React from 'react'
import { Button } from './ui/button'
import useExpenseModal from '@/hooks/useExpenseModal'

type Props = {}

const AddNewExpense = (props: Props) => {
    const productmodal = useExpenseModal()
  return (
    <Button className="w-[150px] " onClick={productmodal.onOpen}>Add New </Button>
  )
}

export default AddNewExpense