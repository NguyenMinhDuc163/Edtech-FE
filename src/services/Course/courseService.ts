import type { Course, CourseCategory, PurchasedCourse } from "@/types/Course/course.type";
import api from "../api";
import type { CourseDetail } from "@/types/Course/course_detail.type";
import type { RecommendedCourse } from "@/types/Course/recommended-course.type";

export type CourseQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: CourseCategory;
  sort?: "asc" | "desc";
};

export type PublicApprovedCourseCountResponse = {
  total: number;
};

const mapToRecommendedCourse = (item: any): RecommendedCourse | null => {
  if (!item?.course_id) return null;

  const courseId = Number(item.course_id);
  if (isNaN(courseId) || courseId <= 0) return null;

  return {
    courseId,
    title: item.title?.trim() || "Khóa học",
    description: item.description?.trim() || "",
    thumbnailUrl:
      item.thumbnail_url && item.thumbnail_url.startsWith("http")
        ? item.thumbnail_url
        : "/default-course.jpg",
    teacher: item.teacher?.trim() || "Giảng viên",
    price: Number(item.price) || 0,
    currency: item.currency?.trim() || "VND",
    discountAmount: item.discount_amount ? Number(item.discount_amount) : undefined,
    rating: Number(item.rating) || 0,
  };
};

export const courseService = {
  async getCoursesStudentRole(params?: CourseQuery): Promise<Course[]> {
    const response = await api.get("/student/courses", { params });
    return response.data.data;
  },

  async getCourseById(courseId: number): Promise<CourseDetail> {
    const response = await api.get(`/student/courses/${courseId}`);
    return response.data.data;
  },
  async getRecommendedCourses(limit: number = 12): Promise<RecommendedCourse[]> {
    try {
      const response = await api.get("/recommendations/hybrid/me", {
        params: { limit },
      });

      const rawData = response.data?.data ?? response.data ?? [];

      if (!Array.isArray(rawData)) {
        console.warn("Dữ liệu gợi ý không phải mảng:", rawData);
        return [];
      }

      return rawData
        .filter((item: any) => item?.course_id != null)
        .map((item: any): RecommendedCourse => {
          const courseId = Number(item.course_id);

          return {
            courseId: isNaN(courseId) || courseId <= 0 ? 0 : courseId,
            title: item.title?.trim() || "Khóa học",
            description: item.description?.trim() || "",
            thumbnailUrl:
              item.thumbnail_url && item.thumbnail_url.startsWith("http")
                ? item.thumbnail_url
                : "/default-course.jpg",
            teacher: item.teacher?.trim() || "Giảng viên",
            price: Number(item.price) || 0,
            currency: item.currency?.trim() || "VND",
            discountAmount: item.discount_amount ? Number(item.discount_amount) : undefined,
            rating: Number(item.rating) || 0,
          };
        })
        .filter((course) => course.courseId > 0);
    } catch (error: any) {
      console.warn("Lỗi lấy gợi ý:", error.response?.data?.message || error.message);
      return [];
    }
  },

  async getPopularCourses(limit: number = 10): Promise<RecommendedCourse[]> {
    try {
      const response = await api.get("/recommendations/popular", {
        params: { limit },
      });

      const rawData = response.data?.data ?? response.data ?? [];
      if (!Array.isArray(rawData)) return [];

      return rawData
        .map(mapToRecommendedCourse)
        .filter((c): c is RecommendedCourse => c !== null);
    } catch (error) {
      console.error("Lỗi lấy khóa học phổ biến:", error);
      return [];
    }
  },

  getPurchasedCourses: async (): Promise<PurchasedCourse[]> => {
    const response = await api.get("/courses/purchased/list");
    return response.data.data;
  },

  async getPurchasedCourseDetail(courseId: string): Promise<any> {
    const response = await api.get(`/student/courses/${courseId}/syllabus`);
    return response.data.data;
  },

  async createRefund(courseId: number, reason: string): Promise<any> {
    const response = await api.post("/api/refund/create", {
      courseId: courseId.toString(),
      reason: reason,
    });
    return response.data;
  },

  async getCategorySummary(): Promise<any> {
    const response = await api.get("/courses/categories-summary");
    return response.data.data.data;
  }
};

export const getPublicApprovedCourseCount = async (): Promise<number> => {
  const res = await api.get("/courses/count/public-approved");

  return Number(res.data?.data?.total ?? 0);
};
