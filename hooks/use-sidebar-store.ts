import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);

