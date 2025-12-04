import { create } from "zustand";

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: "student" | "instructor" | "admin" | undefined;
}

interface ITokenStore {
  token: string | null;
  user: User | undefined;
  setToken: (token: string | null) => void;
  setUser: (user: User | undefined) => void;
  clearToken: () => void;
}

const tokenFromStorage = localStorage.getItem("token"); // JWT string
const userFromStorage = localStorage.getItem("user");   // user JSON string

const useTokenStore = create<ITokenStore>((set) => ({
  token: tokenFromStorage || null,
  user: userFromStorage && userFromStorage !== "undefined"
    ? JSON.parse(userFromStorage)
    : undefined,
  setToken: (token) => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
    set({ token });
  },
  setUser: (user) => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    set({ user });
  },
  clearToken: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ token: null, user: undefined });
  },
}));

export default useTokenStore;
