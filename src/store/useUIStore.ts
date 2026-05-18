import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isSidebarOpen: boolean;
  themeColor: string;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setThemeColor: (color: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      themeColor: "221.2 83.2% 53.3%", 
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),
      setThemeColor: (color) => set({ themeColor: color }),
    }),
    {
      name: "ui-storage",
    }
  )
);
