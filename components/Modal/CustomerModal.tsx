'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import { toast } from 'sonner';
import ModalHeader from './ModalHeader';
import Input from './Input';
import useCustomerModal from '@/hooks/useCustomerModal';
import { uploadCustomer } from '@/lib/Appwrite/api';

const CustomerModal = () => {
  const router = useRouter();
  const productModal = useCustomerModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: ''
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      //@ts-ignore
      const upload = await uploadCustomer(data);
      if (!upload.success) {
        throw new Error('Failed to create customer');
      }
 
      
      toast.success('Customer created successfully');
      reset();
      productModal.onClose();
      router.push('?Customers');
    } catch (error) {
      toast.error('Failed to create customer');
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader
        title="Add New Customer"
        subtitle="Enter customer details"
      />
      <div className="space-y-4">
        <Input
          id="name"
          label="Full Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    </div>
  );

  return (
    <Modal
      title="Add Customer"
      isOpen={productModal.isOpen}
      onClose={productModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Create Customer"
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default CustomerModal;