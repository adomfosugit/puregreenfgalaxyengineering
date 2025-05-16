'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { FaClipboardList } from "react-icons/fa";
import ModalHeader from './ModalHeader';
import CategoryInput from './CategoryInput';
import ProductDimension from './ProductDimension';
import Input from './Input';
import Modal from './Modal';
import { toast } from 'sonner';
import {uploadAdvertisement } from '@/lib/Appwrite/api';
import useAdvertisement from '@/hooks/useAdvertisement';

enum STEPS {
  CATEGORY = 0,
  DESCRIPTION =1,
}
export const categories = [
  {
    label: 'Billboard',
    icon: FaClipboardList,
    description: 'Billboard',
  },
  {
    label: 'Medians',
    icon: FaClipboardList,
    description: 'Medians',
  },  
];



const Advertisement = () => {
  const router = useRouter();
  const landModal = useAdvertisement();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
     Name:'',
     Location:'',
     category:'',
     Price: 0,
     Quantity:0,
    
       
    },
  });


  const category = watch('category');

 

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.DESCRIPTION) {
      return onNext();
    }
  setIsLoading(true);
    try {
     
      data.Price = parseFloat(data.Price);
        //@ts-ignore
      const upload = await uploadAdvertisement(data);
    console.log(data)
      // Check if the upload was successful
      if (upload.success) {
        toast(`Data uploaded Successfully`);
        reset(); // Reset the form
        router.refresh();
    
       
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
  const actionLabel = useMemo(() => {
    if (step === STEPS.DESCRIPTION) {
      return 'Create';
    }
    return 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined;
    }
    return 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8 ">
      <ModalHeader
        title="Category"
        subtitle="Choose a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(categories) => {
                setCustomValue('category', categories);
              }}
              selected={category === item.label}
              icon={item.icon}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
 


  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
    
      <div className="flex flex-col gap-8">
        <ModalHeader
          title="Product Details"
          subtitle="Share some details about the product"
        />
         <Input
          id="Name"
          label="Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
         <Input
          id="Location"
          label="Location"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
       <Input
          id="Price"
          label="Price"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <ProductDimension
          title="Quantity"
          subtitle="Enter Qunatity"
          onChange={(value) => setCustomValue('Quantity', value)}
          unit= 'Items'
        />
      
        </div>
     
      
    );
  }


  return (
    <Modal
      title="Add your Product"
      isOpen={landModal.isOpen}
      onClose={landModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default Advertisement;