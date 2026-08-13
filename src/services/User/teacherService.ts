import api from "../api";
import type { User } from "@/types/User/users.type";

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
    const response = await api.get<TeachersResponse>("/users/teachers");
    return response.data.data || [];
  },

  async getTeachersList(): Promise<User[]> {
    const response = await api.get<TeachersResponse>("/users/list-teacher");
    return response.data.data || [];
  },

  async deleteUser(userId: string): Promise<string> {
    const response = await api.post<DeleteUserResponse>("/users/delete", { userId });
    return response.data.data.message || "Xóa người dùng thành công";
  },
};
