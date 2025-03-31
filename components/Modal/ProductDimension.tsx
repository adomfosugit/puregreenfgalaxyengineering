'use client';

import { ChangeEvent, useCallback } from 'react';

interface IProductAreaProps {
  title: string;
  subtitle: string;
  onChange: (value: number) => void;
  unit:string;
}
const ProductDimension = ({ title, subtitle,unit, onChange }: IProductAreaProps) => {
  const onAdd = useCallback(
    (e: ChangeEvent<HTMLInputElement> | undefined) => {
      onChange(Number(e?.target.value ?? 1));
    },
    [onChange]
  );
  return (
    <div className="flex flex-row items-center justify-between w-full">
    
      <div className="flex flex-row items-center gap-4">
        <h1>{title}</h1>
        <input
          title={title}
          onChange={(e) => onAdd(e)}
          className="font-light text-neutral-600 border rounded-md border-black outline-black w-20 p-2"
        />
        <div className="w-12 h-12 rounded-full border-[2px] border-black flex items-center justify-center text-black cursor-pointer hover:opacity-80 transition">
          {unit}
        </div>
      </div>
    </div>
  );
};

export default ProductDimension;