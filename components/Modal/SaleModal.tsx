'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import Modal from './Modal';
import useSalesModal from '@/hooks/useSalesModal';
import ModalHeader from './ModalHeader';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
//import Input from './Input';
import { Product } from '@/app/(main)/Product/Column';
import { createSalesAndUpdateProduct1 } from '@/lib/Appwrite/api';
import { Input } from '../ui/input';

type Customer = {
  Name: string;
  Email: string;
  $id: string;
  Phone: string;
};

type SelectedProduct = {
  productId: string;
  quantity: number;
  price: number;
  productData: Product;
};

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
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<{
    productId: string;
    quantity: number;
  }>({ productId: '', quantity: 1 });

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
      products: [],
    },
  });

  const customerId = watch('customerId');
  const selectedCustomer = customers.find(c => c.$id === customerId);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product');
      setIsLoading(false);
      return;
    }

    try {
      const saleData = {
        customerId: data.customerId,
        products: selectedProducts.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const upload = await createSalesAndUpdateProduct1(saleData);
      console.log(saleData)
      
      if (upload.success) {
        toast.success('Sale recorded successfully');
        reset();
        setSelectedProducts([]);
        setCurrentProduct({ productId: '', quantity: 1 });
        salesModal.onClose();
        router.refresh();
      } else {
        toast.error(`Upload Unsuccessful: ${upload.error}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.Name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.Email.toLowerCase().includes(customerSearch.toLowerCase())
  );
  
  const filteredProducts = products.filter(product => 
    product.Name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.Brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addProduct = () => {
    if (!currentProduct.productId) {
      toast.error('Please select a product');
      return;
    }

    if (currentProduct.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    const product = products.find(p => p.$id === currentProduct.productId);
    if (!product) return;

    // Check if product already exists in the list
    const existingIndex = selectedProducts.findIndex(
      item => item.productId === currentProduct.productId
    );

    if (existingIndex >= 0) {
      // Update quantity if product already exists
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity: updatedProducts[existingIndex].quantity + currentProduct.quantity
      };
      setSelectedProducts(updatedProducts);
    } else {
      // Add new product
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: currentProduct.productId,
          quantity: currentProduct.quantity,
          price: product.Price,
          productData: product
        }
      ]);
    }

    // Reset current product selection
    setCurrentProduct({ productId: '', quantity: 1 });
    setProductSearch('');
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setSelectedProducts(selectedProducts.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    ).toFixed(2);
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Sale" 
        subtitle="Link a customer to product purchases" 
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
                      filteredCustomers.map(customer => (
                        <CommandItem
                          value={customer.Email}
                          key={customer.Email}
                          onSelect={() => {
                            setValue('customerId', customer.$id, { shouldValidate: true });
                            setCustomerSearch('');
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customer.$id === customerId ? "opacity-100" : "opacity-0"
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

        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Add Products</label>
            
            {/* Product Search Selector */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !currentProduct.productId && "text-muted-foreground"
                      )}
                    >
                      {currentProduct.productId
                        ? `${products.find(p => p.$id === currentProduct.productId)?.Brand} 
                           ${products.find(p => p.$id === currentProduct.productId)?.Name}`
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
                                  setCurrentProduct(prev => ({
                                    ...prev,
                                    productId: product.$id
                                  }));
                                  setProductSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    product.$id === currentProduct.productId ? "opacity-100" : "opacity-0"
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
              </div>

              <div className="w-24">
                <Input
                  id="quantity"
                 // label="Qty"
                  type="number"
                  value={currentProduct.quantity}
                  onChange={(e) => setCurrentProduct(prev => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 0
                  }))}
                  min="1"
                />
              </div>

              <Button 
                type="button" 
                onClick={addProduct}
                variant="outline"
                size="sm"
                className="h-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Products List */}
          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Products</h4>
              <div className="border rounded-md divide-y">
                {selectedProducts.map((item) => {
                  const product = products.find(p => p.$id === item.productId);
                  if (!product) return null;
                  
                  return (
                    <div key={item.productId} className="p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{product.Brand} {product.Name}</div>
                        <div className="text-sm text-muted-foreground">
                          GHS {product.Price.toFixed(2)} each
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(
                            item.productId, 
                            parseInt(e.target.value) || 1
                          )}
                          min="1"
                          className="w-20 h-8"
                        />
                        
                        <div className="w-20 text-right font-medium">
                          GHS {(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProduct(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Total Price */}
              <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                <span className="text-sm font-medium">Total Price:</span>
                <span className="font-bold">
                  GHS {calculateTotal()}
                </span>
              </div>
            </div>
          )}
        </div>
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