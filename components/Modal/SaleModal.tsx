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

interface SalesModalProps {
  customers: Customer[];
  products: Product[];
}

const SalesModal = ({ customers, products }: SalesModalProps) => {
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
      quantity: 1,
    },
  });

  const customerId = watch('customerId');
  const productId = watch('productId');
  const quantity = watch('quantity');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    try {
      const selectedCustomer = customers.find(c => c.email === data.customerId);
      const selectedProduct = products.find(p => p.$id === data.productId);

      if (!selectedCustomer || !selectedProduct) {
        throw new Error('Invalid customer or product selection');
      }

      const totalPrice = selectedProduct.Price * data.quantity;
      const saleData = {
        customer: selectedCustomer,
        product: selectedProduct,
        quantity: data.quantity,
        totalPrice,
        date: new Date().toISOString()
      };

      // Here you would typically make an API call to record the sale
      console.log('New Sale Recorded:', saleData);
      
      toast.success(`Sale recorded for ${selectedCustomer.name}`);
      reset();
      salesModal.onClose();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.includes(customerSearch) ||
    customer.email.includes(customerSearch)
  );

  const filteredProducts = products.filter(product =>
    product.Name.includes(productSearch) ||
    product.Brand.includes(productSearch)
  );

  const selectedProduct = products.find(p => p.$id === productId);

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
                  ? customers.find(c => c.email === customerId)?.name
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
                      filteredCustomers.map(customer => (
                        <CommandItem
                          value={customer.email}
                          key={customer.email}
                          onSelect={() => {
                            setValue('customerId', customer.email, { shouldValidate: true });
                            setCustomerSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customer.email === customerId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{customer.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {customer.email}
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
                      filteredProducts.map(product => (
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
          id="quantity"
          label="Quantity"
          type="number"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        {/* Total Price Display */}
        {selectedProduct && quantity && (
          <div className="flex justify-between items-center p-2 bg-muted rounded-md">
            <span className="text-sm font-medium">Total Price:</span>
            <span className="font-bold">
              GHS {(selectedProduct.Price * quantity).toFixed(2)}
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
      disabled={isLoading || !customerId || !productId}
    />
  );
};

export default SalesModal;