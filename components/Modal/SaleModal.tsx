'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check, ChevronsUpDown } from 'lucide-react';
import Modal from './Modal';
import useSalesModal from '@/hooks/useSalesModal';
import ModalHeader from './ModalHeader';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import Input from './Input';
import { Customer } from '@/app/(main)/Customers/page';
import { Product } from '@/app/(main)/Product/Column';
import { uploadSales } from '@/lib/Appwrite/api';

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

const SalesModal = ({ customers, products }: SalesModalProps) => {
  console.log(customers)
  const router = useRouter();
  const salesModal = useSalesModal();
  const [isLoading, setIsLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
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
   
      //@ts-ignore
      data.Quantity = parseFloat(data.Quantity)
      //@ts-ignore
      data.Price = parseFloat(selectedProduct?.Price * data.Quantity)
      console.log(data);
      //@ts-ignore
      const upload = await uploadSales(data);
      if(upload.success){
        toast.success(`Sale recorded `);
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


  const selectedProduct = products.find(p => p.$id === productId);
  const selectedCustomer = customers.find(p => p.$id === customerId);
  const filteredCustomers = customers.filter(customer => 
    customer.Name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.Email.toLowerCase().includes(customerSearch.toLowerCase())
  );
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.Name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.Brand.toLowerCase().includes(productSearch.toLowerCase())
  );
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Sale" 
        subtitle="Link a customer to a product purchase" 
      />

      <div className="space-y-4">
        {/* Customer Search Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Customer</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full justify-between",
                  !customerId && "text-muted-foreground"
                )}
              >
                {customerId
                  ? `${selectedCustomer?.Name}`
                  : "Select customer"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Search customers..."
                  value={customerSearch}
                  onValueChange={setCustomerSearch}
                />
                <CommandList>
                  <CommandGroup>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.slice(0,5).map(customer => (
                        <CommandItem
                        //@ts-ignore
                          value={filteredCustomers?.Email}
                          key={customer.Email}
                          onSelect={() => {
                          //@ts-ignore
                            setValue('customerId', customer?.$id, { shouldValidate: true });
                            setCustomerSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customer.Email === customerId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{customer.Name}</span>
                            <span className="text-xs text-muted-foreground">
                              {customer.Email}
                            </span>
                          </div>
                        </CommandItem>
                      ))
                    ) : (
                      <CommandItem className="text-muted-foreground">
                        No customers found
                      </CommandItem>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.customerId && (
            <p className="text-red-500 text-sm mt-1">Customer is required</p>
          )}
        </div>

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

        {selectedProduct && Quantity && (
          <div className="flex justify-between items-center p-2 bg-muted rounded-md">
            <span className="text-sm font-medium">Total Price:</span>
            <span className="font-bold" >
              GHS {(selectedProduct.Price * Quantity).toFixed(2)}
            </span>
          </div>
        )}
      </div>
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

export default SalesModal;