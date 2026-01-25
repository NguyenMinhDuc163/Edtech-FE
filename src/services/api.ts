import { useAuthStore } from "@/store/authStore";
import { useLoadingStore } from "@/store/loadingStore";
import axios from "axios";
import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipLoading?: boolean;
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipLoading?: boolean;
  }
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token?: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token || undefined);
  });
  failedQueue = [];
};

const handleServiceError = async (error: any) => {
  const originalRequest = error.config as AxiosRequestConfig;

  if (!originalRequest?.skipLoading) {
    useLoadingStore.getState().setLoading(false);
  }

  if (!originalRequest || !error.response) return Promise.reject(error);

  if (error.response.status === 403) {
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }

  if (error.response.status !== 401) {
    return Promise.reject(error);
  }

  if (originalRequest._retry) {
    useAuthStore.getState().logout();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  const state = useAuthStore.getState();
  const refreshToken = state.refreshToken;

  if (!refreshToken) {
    state.logout();
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((accessToken) => {
        if (accessToken && originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      })
      .catch((err) => Promise.reject(err));
  }

  isRefreshing = true;

  try {
    const refreshRes: AxiosResponse = await refreshClient.post(
      "/auth/refresh",
      { refresh_token: refreshToken }
    );

    const responseData = refreshRes.data;
    const newAccessToken = responseData?.data?.access_token;
    const newRefreshToken = responseData?.data?.refresh_token;

    if (!newAccessToken) {
      throw new Error("No access token returned");
    }

    state.setAuth({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken || refreshToken,
      userId: state.userId!,
      userName: state.userName!,
      userRoles: state.userRoles!,
    });

    processQueue(null, newAccessToken);

    if (originalRequest.headers) {
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
    }

    return api(originalRequest);
  } catch (err) {
    processQueue(err, null);
    state.logout();
    return Promise.reject(err);
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    useLoadingStore.getState().setLoading(true, {
      showGlobal: !config.skipLoading,
    });

    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().setLoading(false);

    if (response.data && response.data.status === 401) {
      const customError = {
        config: response.config,
        response: {
          status: 401,
          data: response.data,
        },
      };
      return handleServiceError(customError);
    }

    return response;
  },
  (error) => {
    useLoadingStore.getState().setLoading(false);

    return handleServiceError(error);
  }
);

let refreshInterval: ReturnType<typeof setInterval> | null = null;

export const startAutoRefreshService = () => {
  if (refreshInterval) clearInterval(refreshInterval);

  refreshInterval = setInterval(async () => {
    const state = useAuthStore.getState();
    const refreshToken = state.refreshToken;

    if (!refreshToken) return;

    if (isRefreshing) return;

    try {
      console.log("Proactive refreshing token...");

      const res = await refreshClient.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const newAccess = res.data?.data?.access_token;
      const newRefresh = res.data?.data?.refresh_token;

      if (newAccess && state.userId) {
        state.setAuth({
          accessToken: newAccess,
          refreshToken: newRefresh || refreshToken,
          userId: state.userId,
          userName: state.userName!,
          userRoles: state.userRoles!,
        });
        console.log("Token refreshed silently.");
      }
    } catch (error) {
      console.error("Silent refresh failed", error);
    }
  }, 14 * 60 * 1000); // 14 phút
};

export const stopAutoRefreshService = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

export default api;
