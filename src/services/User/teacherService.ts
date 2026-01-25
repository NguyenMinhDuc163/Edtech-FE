import api from "../api";
import type { User } from "@/types/User/users.type";

const API_URL = import.meta.env.VITE_API_URL;

interface TeachersResponse {
  status: number;
  message: string;
  data: User[];
}

interface DeleteUserResponse {
  status: number;
  message: string;
  data: {
    message: string;
  };
}

export const teacherService = {
  async getTeachers(): Promise<User[]> {
    const response = await api.get<TeachersResponse>(`${API_URL}/users/teachers`);
    return response.data.data || [];
  },

  async getTeachersList(): Promise<User[]> {
    const response = await api.get<TeachersResponse>(`${API_URL}/users/list-teacher`);
    return response.data.data || [];
  },

  async deleteUser(userId: string): Promise<string> {
    const response = await api.post<DeleteUserResponse>(`${API_URL}/users/delete`, { userId });
    return response.data.data.message || "Xóa người dùng thành công";
  },
};
