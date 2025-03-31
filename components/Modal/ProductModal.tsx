'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { LiaSolarPanelSolid } from "react-icons/lia";
import { FaCarBattery } from "react-icons/fa";
import { LuCable } from "react-icons/lu";
import { LuCableCar } from "react-icons/lu";
import { GiTestTubes } from "react-icons/gi";
import useProductModal from '@/hooks/useProductmodal';
import ModalHeader from './ModalHeader';
import CategoryInput from './CategoryInput';
import ProductDimension from './ProductDimension';
import Input from './Input';
import Modal from './Modal';
import { toast } from 'sonner';
import { getLoggedInUser, uploadProduct } from '@/lib/Appwrite/api';




enum STEPS {
  CATEGORY = 0,
  DESCRIPTION =1,
  QUANTITY = 2,

}

export const categories = [
  {
    label: 'Panels',
    icon: LiaSolarPanelSolid,
    description: 'Solar Panels',
  },
  {
    label: 'Batteries',
    icon: FaCarBattery,
    description: 'Lithium or Gel battery',
  },
  {
    label: 'Cables',
    icon: LuCable,
    description: 'Cables',
  },
  {
    label: 'Invertors',
    icon: LuCableCar,
    description: 'Invertors',
  },
  {
    label: 'Water Heaters',
    icon: GiTestTubes,
    description: 'Commercial zone',
  },
];



const ProductModal = () => {
  const router = useRouter();
  const landModal = useProductModal();

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
      category:'',
      price: 1,
      description:'',
      quantity:1,
      brand:'',
      width:1,
      length:1,
      name:''
   
  
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
    if (step !== STEPS.QUANTITY) {
      return onNext();
    }
  setIsLoading(true);
    try {
      const userEmail = await getLoggedInUser();
      data.userEmail = userEmail.email;
      data.price = parseFloat(data.price);
        //@ts-ignore
      const upload = await uploadProduct(data);
  
      // Check if the upload was successful
      if (upload.success) {
        toast(`Product Successfully uploaded`);
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
    if (step === STEPS.QUANTITY) {
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
          id="name"
          label="Product Name"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
         <Input
          id="brand"
          label="Product Brand"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
       <Input
          id="description"
          label="Product Description"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <div className='flex mx-auto justify-start space-x-3'> 
        <ProductDimension
          title="Width"
          subtitle="Enter the width of your product"
          onChange={(value) => setCustomValue('width', value)}
          unit='m'
        />
        <ProductDimension
          title="Length"
          subtitle="Enter the length of your product"
          onChange={(value) => setCustomValue('length', value)}
          unit='m'
        />
        </div>
      
        
      </div>
       
      
    );
  }

  if (step === STEPS.QUANTITY) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <ModalHeader
          title="Quantity & Price"
          subtitle="quantity and price"
        />
        <ProductDimension
          title="price"
          subtitle="Enter the price of your product"
          onChange={(value) => setCustomValue('price', value)}
          unit='GHS'
          
        />
        <ProductDimension
          title="quantity"
          subtitle="Enter the length of your product"
          onChange={(value) => setCustomValue('quantity', value)}
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

export default ProductModal;