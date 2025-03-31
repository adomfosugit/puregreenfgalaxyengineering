'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Modal from './Modal';
import { toast } from 'sonner';
import ModalHeader from './ModalHeader';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Input from './Input';
import usePurchaseModal from '@/hooks/usePurchaseModal';

// Dummy data
const dummyCustomers = [
  { id: 'cust-1', name: 'Solar Solutions Inc.', email: 'contact@solarsolutions.com' },
  { id: 'cust-2', name: 'Green Energy Co-op', email: 'orders@greencoop.org' },
  { id: 'cust-3', name: 'EcoHome Installations', email: 'sales@ecohome.com' },
  { id: 'cust-4', name: 'Sunshine Farms', email: 'manager@sunshinefarms.com' },
];

const dummyProducts = [
  { id: 'SP-1001', name: 'LG Neon R 375W', brand: 'LG', price: 249 },
  { id: 'SP-1002', name: 'Canadian Solar HiKu 400W', brand: 'Canadian Solar', price: 189 },
  { id: 'SP-1003', name: 'SunPower Maxeon 3 400W', brand: 'SunPower', price: 319 },
  { id: 'INV-2001', name: 'SolarEdge SE5000H', brand: 'SolarEdge', price: 1299 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
  { id: 'BAT-3001', name: 'Tesla Powerwall 2', brand: 'Tesla', price: 6999 },
];

const PurchaseModal = () => {
  const router = useRouter();
  const salesModal = usePurchaseModal();
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
      price: 1,
      productId: '',
      quantity: 1,
    },
  });

  const customerId = watch('customerId');
  const productId = watch('productId');

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const customer = dummyCustomers.find(c => c.id === data.customerId);
      const product = dummyProducts.find(p => p.id === data.productId);

      console.log('New Sale Recorded:', {
        customer,
        product,
        quantity: data.quantity,
        totalPrice: product ? product.price * data.quantity : 0,
        date: new Date().toISOString()
      });

      toast.success(`Sale recorded for ${customer?.name}`);
      reset();
      salesModal.onClose();
    } catch (error) {
      toast.error('Failed to record sale');
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Purchase" 
        subtitle="Restock product " 
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
                  ? `${dummyProducts.find((product) => product.id === productId)?.brand} 
                     ${dummyProducts.find((product) => product.id === productId)?.name}`
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
                    {dummyProducts
                      .filter((product) =>
                        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.brand.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map((product) => (
                        <CommandItem
                          value={product.id}
                          key={product.id}
                          onSelect={() => {
                            setValue('productId', product.id);
                            setProductSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product.id === productId ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{product.brand} {product.name}</span>
                            <span className="text-xs text-muted-foreground">
                              GHS {product.price}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
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
        <Input
          id="price"
          label="price"
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
      actionLabel="Record Purchase"
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default PurchaseModal;