'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { deleteExpense, deleteInvoice, deleteProduct, deletePurchases, deleteSales } from "@/lib/Appwrite/api";
import { usePathname, useRouter } from "next/navigation";



const deleteActions = {
  expense: deleteExpense,
  invoice: deleteInvoice,
  product: deleteProduct,
  restock: deletePurchases,
  sale: deleteSales,
};
interface DeleteModalProps {
  id: string;
  type: keyof typeof deleteActions;  // Ensure we only pass valid types
}

export function DeleteModal({ id, type }: DeleteModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  console.log(pathname)

  const handleDelete = async () => {
    const deleteFunction = deleteActions[type] // Get the correct delete function based on type

    if (!deleteFunction) {
      console.error("No delete function found for this type.")
      toast.error("Invalid delete action ❌")
      return
    }

    try {
      await deleteFunction(id)  // Call the delete function
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully! ✅`)
      router.push(pathname)
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error)
      toast.error(`Failed to delete ${type} ❌`)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="text-red-600">X</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. Deleting this {type} with ID: {id}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
