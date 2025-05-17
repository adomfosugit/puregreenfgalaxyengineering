'use client';
import { useEffect, useState, useMemo } from 'react';
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
import { createAdvertisementDeal, getinitialProducts, getinitialProductsAD, getSearchProducts, getSearchProductsAD } from '@/lib/Appwrite/api';
import { Input } from '../ui/input';
import { useDebouncedCallback } from 'use-debounce';
import useAdvertisementDeal from '@/hooks/useAdvetisementDeal';
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format, differenceInMonths, addDays } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type SelectedProduct = {
  productId: string;
  quantity: number;
  price: number;
  productData: Product;
  location: string;
};

const Admanager = () => {
  const router = useRouter();
  const salesModal = useAdvertisementDeal();
  const [isLoading, setIsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<{
    productId: string;
    quantity: number;
    productData: Product | null;
  }>({ productId: '', quantity: 1, productData: null });

  const form = useForm<FieldValues>({
    defaultValues: {
      CustomerName: '',
      PhoneNumber: '',
      AmountPaid: 0,
      TenureStart: null,
      TenureEnd: null,
      products: [],
    },
  });

  // Watch tenure dates
  const tenureStart = form.watch("TenureStart");
  const tenureEnd = form.watch("TenureEnd");

  // Calculate rental duration in months
  const rentalDuration = useMemo(() => {
    if (!tenureStart || !tenureEnd) return 0;
    
    // Add one day to end date to include the last day in calculation
    const endDate = addDays(new Date(tenureEnd), 1);
    const months = differenceInMonths(endDate, new Date(tenureStart));
    
    // Ensure at least 1 month even for partial months
    return Math.max(1, months);
  }, [tenureStart, tenureEnd]);

  // Product handling
  const fetchProducts = async (searchTerm = '') => {
    try {
      const products = searchTerm 
        ? await getSearchProductsAD(searchTerm)
        : await getinitialProductsAD();
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
          productData: currentProduct.productData,
          location: currentProduct.productData.Location
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
    if (!tenureStart || !tenureEnd) {
      return "0.00 (select dates)";
    }

    const subtotal = selectedProducts.reduce(
      (sum, item) => sum + (item.price * item.quantity * rentalDuration),
      0
    );
    
    return subtotal.toFixed(2);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    
    if (selectedProducts.length === 0) {
      toast.error('Please add at least one product');
      setIsLoading(false);
      return;
    }

    if (!data.TenureStart || !data.TenureEnd) {
      toast.error('Please select start and end dates');
      setIsLoading(false);
      return;
    }

    try {
      const advertisementData = {
        CustomerName: data.CustomerName,
        PhoneNumber: data.PhoneNumber,
        AmountPaid: parseFloat(data.AmountPaid),
        TenureStart: data.TenureStart,
        TenureEnd: data.TenureEnd,
        DurationMonths: rentalDuration,
        products: selectedProducts.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          location: item.location,
          totalPrice: item.price * item.quantity * rentalDuration
        }))
      };
      console.log(advertisementData)

      const upload = await createAdvertisementDeal(advertisementData);
      
      if (upload.success) {
        toast.success('Advertisement deal recorded successfully');
        window.location.href = '/AdvertManager';
        form.reset();
        setSelectedProducts([]);
        setCurrentProduct({ productId: '', quantity: 1, productData: null });
        salesModal.onClose();
      } else {
        toast.error(`Upload Unsuccessful: ${upload.error}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to record advertisement deal');
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <ModalHeader 
        title="Record New Advertisement Deal" 
        subtitle="Track products lent out for advertisement" 
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="CustomerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer/Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer/company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="PhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tenure Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="TenureStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="TenureEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick an end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("TenureStart");
                          return startDate ? date < new Date(startDate) : date < new Date();
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Rental Duration Display */}
          {tenureStart && tenureEnd && (
            <div className="text-sm text-muted-foreground">
              Rental Duration: {rentalDuration} month{rentalDuration !== 1 ? 's' : ''}
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Add Advertisement Products</label>
              
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
                          ? `${currentProduct.productData.Location} ${currentProduct.productData.Name}`
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
                                  value={`${product.Location} ${product.Name}`}
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
                                    <span>{product.Location} {product.Name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      GHS {product.Price.toFixed(2)}/month
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
                    placeholder="Qty"
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
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Selected Products</h4>
                <div className="border rounded-md divide-y">
                  {selectedProducts.map((item) => (
                    <div key={item.productId} className="p-3 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-medium">{item.productData.Location} {item.productData.Name}</div>
                        <div className="text-sm text-muted-foreground">
                          GHS {item.productData.Price.toFixed(2)}/month × {rentalDuration} month{rentalDuration !== 1 ? 's' : ''}
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
                        
                        <div className="w-24 text-right font-medium">
                          GHS {(item.price * item.quantity * rentalDuration).toFixed(2)}
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

                {/* Payment Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="AmountPaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount Paid (GHS)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter amount paid" 
                            {...field} 
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Total Rental Value</span>
                    {tenureStart && tenureEnd && (
                      <span className="text-xs text-muted-foreground">
                        For {rentalDuration} month{rentalDuration !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <span className="font-bold">
                    GHS {calculateTotal()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={salesModal.onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : "Record Advertisement"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );

  return (
    <Modal
      isOpen={salesModal.isOpen}
      onClose={salesModal.onClose}
      onSubmit={form.handleSubmit(onSubmit)}
      actionLabel="Record Advertisement"
      body={bodyContent}
      disabled={isLoading}
    />
  );
};

export default Admanager;