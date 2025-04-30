'use client';
import {  useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import ModalHeader from './ModalHeader';

import Input from './Input';
import Modal from './Modal';
import { toast } from 'sonner';
import {  uploadExpenses } from '@/lib/Appwrite/api';
import useExpenseModal from '@/hooks/useExpenseModal';

const ExpenseModal = () => {
  const router = useRouter();
  const landModal = useExpenseModal();

  const [isLoading, setIsLoading] = useState(false);
 

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      Tax:'',
      Salary: '',
      Electricity:'',
      Water:'',
      Internet:'',
      Transport:'',
      Other:'',
      Comment:''
     
   
  
    },
  });


 

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
   
  setIsLoading(true);
    try {
      
        //@ts-ignore
      const upload = await uploadExpenses({
        Electricity:parseFloat(data.Electricity),
        Water: parseFloat(data.Water),
        Tax:parseFloat(data.Tax),
        Transport: parseFloat(data.Transport),
        Salary:parseFloat(data.Salary),
        Internet:parseFloat(data.Internet),
        Other:parseFloat(data.Other),
        Comment:data.Comment},
      );
  
      // Check if the upload was successful
      if (upload.success) {
        toast(`Expenses Successfully uploaded`);
        window.location.href = '/Dashboard';
        reset(); // Reset the form
    
       
      } else {
        // Handle upload failure
        toast(`Upload Unsuccessful: ${upload.error}`);
      }
    } catch (error) {
      console.error('Error uploading land data:', error);
      toast(`Upload Unsuccessful: An unexpected error occurred. Please try again later.`);
    } finally {
      setIsLoading(false);
      landModal.onClose()
      
    }
  };


  let bodyContent = (
    <div className="flex flex-col gap-8 ">
      <ModalHeader
        title="Expenses"
        subtitle="Create Expense"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
      <Input
          id="Electricity"
          label="Electricity"
          disabled={isLoading}
          register={register}
          errors={errors}
    
          
        />
         <Input
          id="Water"
          label="Water"
          disabled={isLoading}
          register={register}
          errors={errors}
        
        />
       <Input
          id="Tax"
          label="Tax"
          disabled={isLoading}
          register={register}
          errors={errors}
          
        />
       <Input
          id="Salary"
          label="Salary"
          disabled={isLoading}
          register={register}
          errors={errors}
    
        />
       <Input
          id="Transport"
          label="Transport"
          disabled={isLoading}
          register={register}
          errors={errors}
      
        />
       <Input
          id="Internet"
          label="Internet"
          disabled={isLoading}
          register={register}
          errors={errors}
          
        />
       <Input
          id="Other"
          label="Other"
          disabled={isLoading}
          register={register}
          errors={errors}
        
        />
       <Input
          id="Comment"
          label="Comment"
          disabled={isLoading}
          register={register}
          errors={errors}
        
        />
      </div>
    </div>
  );




  return (
    <Modal
      title="Add your Expenses"
      isOpen={landModal.isOpen}
      onClose={landModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel='Add Expenses'
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default ExpenseModal;