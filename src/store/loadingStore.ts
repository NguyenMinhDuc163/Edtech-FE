import { create } from "zustand";

interface LoadingOptions {
  showGlobal?: boolean;
}

interface LoadingState {
  isLoading: boolean;
  showGlobal: boolean;
  setLoading: (status: boolean, options?: LoadingOptions) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  showGlobal: true,

  setLoading: (status: boolean, options?: LoadingOptions) =>
    set(() => ({
      isLoading: status,
      showGlobal: status ? options?.showGlobal ?? true : true,
    })),
}));
