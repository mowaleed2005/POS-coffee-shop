import { create } from "zustand";

export const domain = "http://localhost:1337/";

export const useCart = create((set) => ({
  cart: [],
  setCart: (newCart) => set({ cart: newCart }),
}));