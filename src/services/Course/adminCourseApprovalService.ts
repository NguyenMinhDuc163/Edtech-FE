import api from "@/services/api";
import type { Course } from "@/types/Course/course.type";

export const adminCourseApprovalService = {
  async getPending(): Promise<Course[]> {
    const res = await api.get("/admin/approvals/pending");
    return res.data.data || res.data || [];
  },

  async approve(courseId: number) {
    const res = await api.post(`/admin/approvals/${courseId}/approve`);
    return res.data;
  },

  async reject(courseId: number, reason: string) {
    const res = await api.post(`/admin/approvals/${courseId}/reject`, { reason });
    return res.data;
  },

  async history(courseId: number) {
    const res = await api.get(`/admin/approvals/${courseId}/history`);
    return res.data.data || res.data;
  },
};
