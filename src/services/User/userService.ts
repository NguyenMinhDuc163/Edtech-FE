import defaultAvatar from "@/assets/pictures/student.png";
import { useAuthStore } from "@/store/authStore";
import type { StudentCountResponse, TeacherCountResponse, User } from "@/types/User/users.type";
import api from "../api";

function getRoleString(raw: any): string {
  if (typeof raw === "string") return raw;

  if (Array.isArray(raw) && raw.length > 0) {
    const firstRole = raw[0];
    if (typeof firstRole === "string") return firstRole;
    if (
      firstRole &&
      firstRole.role &&
      typeof firstRole.role.name === "string"
    ) {
      return firstRole.role.name;
    }
  }

  if (raw && raw.role && typeof raw.role.name === "string") {
    return raw.role.name;
  }

  return "student";
}

export const userService = {
  async getProfile(): Promise<User | null> {
    const state = useAuthStore.getState();
    try {
      const res = await api.get("/auth/me");

      const data = res.data?.data;

      if (res.data.status !== 200) {
        console.warn("Không nhận được dữ liệu người dùng hợp lệ từ API");
        state.logout();
        return null;
      }

      const userData: User = {
        id: data.id,
        username: data.username,
        full_name: data.full_name,
        email: data.email,
        avatar_url: data.avatar_url || defaultAvatar,
        role: getRoleString(data.roles || data.user_roles || data.role),
      };

      return userData;
    } catch (err: any) {
      console.error("Lỗi khi lấy profile:", err.response?.data || err.message);

      state.logout();
      return null;
    }
  },
  async logoutServer() {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.warn("Logout server thất bại:", err);
    } finally {
      useAuthStore.getState().logout();
    }
  },

  async getUser(): Promise<User | null> {
    const state = useAuthStore.getState();
    try {
      const res = await api.get("/users/me/profile");

      const data = res.data?.data;

      if (res.data.status !== 200) {
        console.warn("Không nhận được dữ liệu người dùng hợp lệ từ API");
        state.logout();
        return null;
      }

      const userData: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar_url: data.avatar_url || defaultAvatar,
        role: getRoleString(data.roles || data.user_roles || data.role),
        full_name: data.full_name,
        phone: data.phone,
        grade: data.grade,
        subject_specialty: data.subject_specialty,
      };

      return userData;
    } catch (err: any) {
      state.logout();
      return null;
    }
  },

  async updateProfile(formData: FormData): Promise<User> {
    const response = await api.post("/users/me/profile", formData);
    return response.data.data;
  },

  async changePassword(input: any) {
    const response = await api.post("/auth/password/change", input);
    const status = response.data.status;
    if (status !== 200) {
      return {
        status: false,
        message: response.data.message,
      };
    }
    return {
      status: true,
      message: "Đổi mật khẩu thành công",
    };
  },
};
export const getStudentCount = async (): Promise<number> => {
  const res = await api.get<StudentCountResponse>("/users/count/students");
  return res.data.data.students;
};

export const getTeacherCount = async (): Promise<number> => {
  const res = await api.get<TeacherCountResponse>("/users/count/teachers");
  return res.data.data.teachers;
};
