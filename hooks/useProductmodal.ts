import { create } from 'zustand';

interface IProductModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useProductModal = create<IProductModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useProductModal;