'use client';
import { Product } from '@/app/(main)/Product/Column';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useSalesModal from '@/hooks/useSalesModal';
import { getLoggedInUser, uploadPurchase } from '@/lib/Appwrite/api';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Input from './Input';
import Modal from './Modal';
import ModalHeader from './ModalHeader';
import usePurchaseModal from '@/hooks/usePurchaseModal';

type customer1 = {
  Name:string;
  Email:string;
  $id:string;
  Phone:string;
}
interface SalesModalProps {
  customers: customer1[];
  products: Product[];
}

const PurchaseModal = ({ products }: SalesModalProps) => {
  const router = useRouter();
  const salesModal = usePurchaseModal();
  const [isLoading, setIsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      customerId: '',
      productId: '',
      Price:1,
      Quantity:1
    },
  });

  const customerId = watch('customerId');
  const productId = watch('productId');
  const Quantity = watch('Quantity');


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    try {
      const user = await getLoggedInUser()
      //@ts-ignore
      data.Quantity = parseFloat(data.Quantity)
      data.uploader = user.email
      //@ts-ignore
      data.Price = parseFloat(selectedProduct?.Price)
      console.log(data);
      //@ts-ignore
      const upload = await uploadPurchase(data);
      if(upload.success){
        toast.success(`Purchase recorded `);
        reset();
        salesModal.onClose();
        router.refresh();
      }else {
        // Handle upload failure
        toast(`Upload Unsuccessful: ${upload.error}`);
      }
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
    } finally {
      setIsLoading(false);
      salesModal.onClose();
    }
  };


  const selectedProduct = products?.find(p => p.$id === productId);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.Name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.Brand.toLowerCase().includes(productSearch.toLowerCase())
  );
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Purchase" 
        subtitle="Create purchase" 
      />
        {/* Product Search Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Product</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !productId && "text-muted-foreground"
                )}
              >
                {productId
                  ? `${selectedProduct?.Brand} ${selectedProduct?.Name}`
                  : "Select product"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search products..."
                  value={productSearch}
                  onValueChange={setProductSearch}
                />
                <CommandList>
                  <CommandGroup>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.slice(0,5).map(product => (
                        <CommandItem
                          value={product.$id}
                          key={product.$id}
                          onSelect={() => {
                            setValue('productId', product.$id, { shouldValidate: true });
                            setProductSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.$id === productId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{product.Brand} {product.Name}</span>
                            <span className="text-xs text-muted-foreground">
                              GHS {product.Price.toFixed(2)}
                            </span>
                          </div>
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem className="text-muted-foreground">
                        No products found
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.productId && (
            <p className="text-red-500 text-sm mt-1">Product is required</p>
          )}
        </div>

        {/* Quantity Input */}
        <Input
          id="Quantity"
          label="Quantity"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />


      </div>
    
  );

  return (
    <Modal
      isOpen={salesModal.isOpen}
      onClose={salesModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Record Sale"
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default PurchaseModal;