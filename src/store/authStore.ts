import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;

  userId: string;
  userName: string;
  userRoles: string;

  setAuth: (payload: {
    accessToken: string;
    refreshToken: string;
    userId: string;
    userName: string;
    userRoles: string;
  }) => void;

  logout: () => void;
}

const STORAGE_KEY = "user";

// Load state từ localStorage
const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const stored = loadInitialState();

  return {
    accessToken: stored?.accessToken ?? null,
    refreshToken: stored?.refreshToken ?? null,
    userId: stored?.userId ?? null,
    userName: stored?.userName ?? null,
    userRoles: stored?.userRoles ?? null,

    setAuth: (payload) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      set(payload);
    },

    logout: () => {
      localStorage.removeItem(STORAGE_KEY);
    },
  };
});
