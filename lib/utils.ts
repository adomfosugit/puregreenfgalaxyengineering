import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
export const currencyFormat = (amount: number) => {
  return '$' + amount?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
