"use client";

import { useState } from "react";
import { updateAdvertisementByID, updateProductByID } from "@/lib/Appwrite/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


interface ProductDetailProps {
  details: any;
}

export default function AdvertisementDetail({ details }: ProductDetailProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    Name: details?.Name ?? "",
    category: details?.category ?? "",
    Location: details?.Location ?? "",
    Status: details?.Status ?? "",
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
  
    const success = await updateAdvertisementByID(details.$id, formData)
      .then(() => true)
      .catch((error) => {
        console.error("Failed to update product:", error);
        return false;
      });
  
    if (success) {
      toast("Data successfully updated! 🎉");
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
        <Input name="category" value={formData.category} onChange={handleChange} placeholder="Category" disabled/>
        <p>Location</p>
        <Input name="Location" value={formData.Location} onChange={handleChange} placeholder="Location" />
        <p>Status</p>
        <Input name="Status" value={formData.Status} onChange={handleChange} placeholder="Status" disabled />
        <p>Quantity</p>
        <Input name="Quantity" type="number" value={formData.Quantity} onChange={handleChange} placeholder="Quantity" />
        <p>Price</p>
        <Input name="Price" type="number" value={formData.Price} onChange={handleChange} placeholder="Price" />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
