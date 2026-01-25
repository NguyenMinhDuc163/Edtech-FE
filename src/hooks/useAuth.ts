import { useCallback } from "react";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useShallow } from "zustand/react/shallow";

export function useAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logoutStore = useAuthStore.getState().logout;

  const authState = useAuthStore(
    useShallow((state) => ({
      userId: state.userId,
      userName: state.userName,
      userRoles: state.userRoles,
    }))
  );

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const resp = await api.post("/auth/login", { username, password });

        const data = resp.data?.data;
        const accessToken = data?.access_token;
        const refreshToken = data?.refresh_token;
        const user = data?.user;

        if (!accessToken || !refreshToken || !user) {
          return {
            status: 500,
            message: "Đăng nhập không thành công. Vui lòng thử lại.",
          };
        }

        setAuth({
          accessToken,
          refreshToken,
          userId: user.id,
          userName: user.username,
          userRoles: user.role,
        });

        return { status: 200, data };
      } catch (error: any) {
        return {
          status: error.response?.status ?? 500,
          message:
            error.response?.data?.message || "Sai tài khoản hoặc mật khẩu",
        };
      }
    },
    [setAuth]
  );

  const logout = useCallback(() => {
    logoutStore();
  }, []);

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      const resp = await api.post("/auth/register", {
        email,
        username,
        password,
      });

      const status = resp.data?.status;

      if (status === 201) {
        return {
          status: 201,
          message: "Đăng ký tài khoản thành công.",
        };
      }

      return {
        status: status,
        message:
          resp.data?.message ||
          "Đăng ký không thành công. Vui lòng thử lại sau.",
      };
    },
    []
  );

  return {
    login,
    logout,
    register,
    authState,
  };
}
