import { create } from 'zustand';

interface IProductModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSalesModal = create<IProductModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSalesModal;