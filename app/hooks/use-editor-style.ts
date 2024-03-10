import { create } from "zustand";

interface EditorStyleStore {
  index: number | null;
  setIndex: (value: number) => void;
  isShown: boolean;
  setIsShow: (value: boolean) => void;
  itemIndex: number | null;
  setItemIndex: (value: number) => void;
  position: [top: string, right: string, bottom: string, left: string];
  setPosition: (
    value: [top: string, right: string, bottom: string, left: string]
  ) => void;
}

export const useEditorStyle = create<EditorStyleStore>((set) => ({
  index: null,
  setIndex: (value: number) => set({ index: value }),
  isShown: false,
  setIsShow: (value: boolean) => set({ isShown: value }),
  itemIndex: null,
  setItemIndex: (value: number) => set({ itemIndex: value }),
  position: ["0px", "none", "none", "0px"],
  setPosition: (
    value: [top: string, right: string, bottom: string, left: string]
  ) => set({ position: [value[0], value[1], value[2], value[3]] }),
}));
