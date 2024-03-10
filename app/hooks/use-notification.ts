import { create } from "zustand";

interface NotificationUIStore {
  isShown: boolean;
  setIsShown: (value: boolean) => void;
  type: "success" | "warning" | "error" | null;
  setType: (value: "success" | "warning" | "error" | null) => void;
  title: string | null;
  setTitle: (value: string | null) => void;
  content: string;
  setContent: (value: string) => void;
}

export const useNotification = create<NotificationUIStore>((set) => ({
  isShown: false,
  setIsShown: (value: boolean) => set({ isShown: value }),
  type: null,
  setType: (value: "success" | "warning" | "error" | null) =>
    set({ type: value }),
  title: null,
  setTitle: (value: string | null) => set({ title: value }),
  content: "",
  setContent: (value: string) => set({ content: value }),
}));
