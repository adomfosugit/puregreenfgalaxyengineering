'use client';

import { useState } from 'react';
import { TbPhotoPlus } from 'react-icons/tb';
import Image from 'next/image';
import { registerProduct } from '@/lib/Appwrite/api';


interface IImageUploadProps {
  onChange: (value: string[]) => void;
  value: string[];
}

const ImageUpload = ({ value, onChange }: IImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('productimage', file);

        // Call the server action to upload the file to Appwrite
        const response = await registerProduct(formData);
        if (response?.url) {
          uploadedUrls.push(response.url);
        }
      }

      // Update the parent component with the new image URLs
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="relative cursor-pointer hover:opacity-70 transition border-dashed border-2 p-20 border-neutral-300 flex flex-col justify-center items-center gap-4 text-neutral-400"
      onClick={() => document.getElementById('file-input')?.click()}
    >
      <TbPhotoPlus size={50} />
      {value.length === 0 && (
        <div className="font-semibold text-lg">Click to upload</div>
      )}
      <input
        id="file-input"
        type="file"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />
      <div className="absolute inset-0 w-full h-full grid grid-flow-col gap-2">
        {value.length > 0 &&
          value.map((image, index) => (
            <Image
              priority
              key={index}
              alt="Upload"
              height={150}
              width={150}
              style={{ objectFit: 'contain' }}
              src={`${image}`}
            />
          ))}
      </div>
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <span className="text-white">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;