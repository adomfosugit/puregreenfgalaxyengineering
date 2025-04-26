"use client";

import { useState } from "react";
import { updateProductByID } from "@/lib/Appwrite/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface ProductDetailProps {
  details: any;
}

export default function ProductDetail({ details }: ProductDetailProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    Name: details?.Name ?? "",
    Category: details?.Category ?? "",
    Brand: details?.Brand ?? "",
    Dimension_Length: details?.Dimension_Length ?? 0,
    Dimension_Width: details?.Dimension_Width ?? 0,
    Description: details?.Description ?? "",
    Quantity: details?.Quantity ?? 0,
    Price: details?.Price ?? 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Dimension") || name === "Quantity" || name === "Price"
        ? Number(value)
        : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
  
    const success = await updateProductByID(details.$id, formData)
      .then(() => true)
      .catch((error) => {
        console.error("Failed to update product:", error);
        return false;
      });
  
    if (success) {
      toast("Product successfully updated! 🎉");
      // You can reset the form if you want, but usually for edit we keep it
      router.refresh();
    }
  
    setIsSaving(false);
  };
  

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-1">
        <p>Product Name</p>
        <Input name="Name" value={formData.Name} onChange={handleChange} placeholder="Name" />
        <p>Category</p>
        <Input name="Category" value={formData.Category} onChange={handleChange} placeholder="Category" disabled/>
        <p>Brand</p>
        <Input name="Brand" value={formData.Brand} onChange={handleChange} placeholder="Brand" />
        <div className="flex flex-row justify-between w-[500px]  ">
            <div>
            <p>Length</p>
          <Input name="Dimension_Length" type="number" value={formData.Dimension_Length} onChange={handleChange} placeholder="Length" />
        </div>
        <div>
        <p>Width</p>
          <Input name="Dimension_Width" type="number" value={formData.Dimension_Width} onChange={handleChange} placeholder="Width" />
        </div>

        </div>
        <p>Description</p>
        <Input name="Description" value={formData.Description} onChange={handleChange} placeholder="Description" />
        <p>Quantity</p>
        <Input name="Quantity" type="number" value={formData.Quantity} onChange={handleChange} placeholder="Quantity" disabled />
        <p>Price</p>
        <Input name="Price" type="number" value={formData.Price} onChange={handleChange} placeholder="Price" />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
