'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import Modal from './Modal';

import ModalHeader from './ModalHeader';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Product } from '@/app/(main)/Product/Column';
import { createSalesAndUpdateProduct1, getinitialCustomers, getinitialProducts, getSearchCustomers, getSearchProducts } from '@/lib/Appwrite/api';
import { Input } from '../ui/input';
import { useDebouncedCallback } from 'use-debounce';
import useSalesModal from '@/hooks/useSalesModal';

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

const SalesModal = () => {
  const router = useRouter();
  const salesModal = useSalesModal();
  const [isLoading, setIsLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<{
    productId: string;
    quantity: number;
    productData: Product | null;
  }>({ productId: '', quantity: 1, productData: null });

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
      discount: 0,
      taxRate: 0
    },
  });

  // Customer handling
  const fetchInitialCustomers = async () => {
    try {
      const customers = await getinitialCustomers();
      {/* @ts-ignore*/}
      setFilteredCustomers(customers);
    } catch (error) {
      console.error('Error fetching initial customers:', error);
    }
  };

  const debouncedSearchCustomers = useDebouncedCallback(async (searchTerm: string) => {
    const customers = await getSearchCustomers(searchTerm);
    {/* @ts-ignore*/}
    setFilteredCustomers(customers);
  }, 300);

  useEffect(() => {
    fetchInitialCustomers();
  }, []);

  useEffect(() => {
    if (customerSearch) {
      debouncedSearchCustomers(customerSearch);
    } else {
      fetchInitialCustomers();
    }
  }, [customerSearch]);

  // Product handling
  const fetchProducts = async (searchTerm = '') => {
    try {
      const products = searchTerm 
        ? await getSearchProducts(searchTerm)
        : await getinitialProducts();
        {/* @ts-ignore*/}
      setFilteredProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const debouncedSearchProducts = useDebouncedCallback(async (searchTerm: string) => {
    await fetchProducts(searchTerm);
  }, 300);

  useEffect(() => {
    if (productSearch) {
      debouncedSearchProducts(productSearch);
    } else if (filteredProducts.length === 0) {
      fetchProducts();
    }
  }, [productSearch]);

  const handleProductSelect = (productId: string) => {
    const product = filteredProducts.find(p => p.$id === productId);
    if (product) {
      setCurrentProduct(prev => ({
        ...prev,
        productId,
        productData: product
      }));
    }
  };

  const addProduct = () => {
    if (!currentProduct.productId || !currentProduct.productData) {
      toast.error('Please select a valid product');
      return;
    }
  
    if (currentProduct.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
  
    const existingIndex = selectedProducts.findIndex(
      item => item.productId === currentProduct.productId
    );
  
    if (existingIndex >= 0) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        quantity: updatedProducts[existingIndex].quantity + currentProduct.quantity
      };
      setSelectedProducts(updatedProducts);
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: currentProduct.productId,
          quantity: currentProduct.quantity,
          price: currentProduct.productData.Price,
          productData: currentProduct.productData
        }
      ]);
    }
  
    setCurrentProduct({ productId: '', quantity: 1, productData: null });
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
    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    
    const discountValue = watch('discount') || 0;
    const taxRateValue = watch('taxRate') || 0;
  
    const taxAmount = subtotal * (taxRateValue / 100);
    const new_total = taxAmount + subtotal;
    const discountedAmount = (new_total) - (new_total * (discountValue / 100));
    
    return discountedAmount.toFixed(2);
  };

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
        Discount: parseFloat(data.discount),
        Tax: parseFloat(data.taxRate),
        products: selectedProducts.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const upload = await createSalesAndUpdateProduct1(saleData);
      
      if (upload.success) {
        toast.success('Sale recorded successfully');
        //router.push('/Sales')
        //router.refresh();
        window.location.href = '/Sales';
        reset();
        setSelectedProducts([]);
        setCurrentProduct({ productId: '', quantity: 1, productData: null });
      
      
        salesModal.onClose();
        
      } else {
        toast.error(`Upload Unsuccessful: ${upload.error}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record sale');
    } finally {
      setIsLoading(false);
    }
  };

  const customerId = watch('customerId');

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Sale" 
        subtitle="Link a customer to product purchases" 
      />

      <div className="space-y-4">
        {/* Customer Selection */}
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
                  ? filteredCustomers.find(c => c.$id === customerId)?.Name || "Selected customer"
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
                          value={customer.Name + " " + customer.Email}
                          key={customer.$id}
                          onSelect={() => {
                            setValue('customerId', customer.$id, { shouldValidate: true });
                            //setCustomerSearch('');
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
                      {currentProduct.productData
                        ? `${currentProduct.productData.Brand} ${currentProduct.productData.Name}`
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
                                value={`${product.Brand} ${product.Name}`}
                                key={product.$id}
                                onSelect={() => handleProductSelect(product.$id)}
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

          {selectedProducts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Products</h4>
              <div className="border rounded-md divide-y">
                {selectedProducts.map((item) => (
                  <div key={item.productId} className="p-3 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="font-medium">{item.productData.Brand} {item.productData.Name}</div>
                      <div className="text-sm text-muted-foreground">
                        GHS {item.productData.Price.toFixed(2)} each
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
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tax (%)</label>
                <Input
                  id='taxRate'
                  type="number"
                  {...register('taxRate', {
                    valueAsNumber: true,
                    min: 0,
                    max: 100
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Discount (%)</label>
                <Input
                  id='discount'
                  type="number"
                  {...register('discount', {
                    valueAsNumber: true,
                    min: 0,
                    max: 100
                  })}
                />
              </div>
              
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