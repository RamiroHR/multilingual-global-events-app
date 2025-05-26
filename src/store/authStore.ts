import { create } from "zustand";
import { AuthState } from "./authStore.types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: (user) => set({ user, isLoggedIn: true }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isLoggedIn: false });
  },
}));
