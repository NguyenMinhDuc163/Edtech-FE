import type { CourseDetail } from "@/types/Course/course.type";
import api from "../api";
import type { DashboardQuery, DetailStats, ExamStats, OverviewStats } from "@/pages/Admin/Home/libs/interface/types";

export const adminCourseService = {
  getCourseResults: async (
    params: { page?: number; limit?: number },
    body: any
  ) => {
    const res = await api.post(`/admin/courses/result`, body, { params });
    return res.data.data;
  },

  getCourseLeaderboard: async (
    params: { page?: number; limit?: number },
    filters?: Record<string, any>
  ) => {
    const queryParams = {
      ...(params || {}),
      ...(filters || {}),
    };
    const res = await api.get("/admin/courses/leaderboard", {
      params: queryParams,
    });
    return res.data.data;
  },

  getAdminCourses: async (
    params: { page?: number; limit?: number },
    filters?: Record<string, any>
  ) => {
    const queryParams = {
      ...(params || {}),
      ...(filters || {}),
    };

    const res = await api.get("/admin/courses", {
      params: queryParams,
    });

    return res.data.data;
  },

  async getAdminCourseById(courseId: number): Promise<CourseDetail> {
    const response = await api.get(`/courses/${courseId}`);
    return response.data.data;
  },

  exportCourse: async (courseId: string) => {
    const res = await api.get(`/admin/courses/${courseId}/export`, {
      responseType: "blob",
    });
    return res;
  },

  getOverview: async (params: DashboardQuery): Promise<OverviewStats> => {
    const res = await api.get("/admin/dashboard/overview", { params });
    return res.data.data;
  },

  getDetails: async (params: DashboardQuery): Promise<DetailStats> => {
    const res = await api.get("/admin/dashboard/detail", { params });
    return res.data.data;
  },

  getExamStats: async (params: DashboardQuery): Promise<ExamStats> => {
    const res = await api.get("/admin/dashboard/exams", { params });
    return res.data.data;
  },

  async getLessonDetail(lessionId: string): Promise<any> {
    const res = await api.get(`/contents/${lessionId}`);

    return res.data.data;
  }
};
