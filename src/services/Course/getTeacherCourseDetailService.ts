import api from "@/services/api";
import type { CourseDetail } from "@/types/Course/course.type";

export const getTeacherCourseDetail = async (
  courseId: string
): Promise<CourseDetail> => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching course detail:", error);
    throw error;
  }
};

export const changeCourseVisibility = async (
  courseId: string,
  visibility: "PUBLIC" | "PRIVATE"
): Promise<any> => {
  try {
    const response = await api.patch(`/courses/${courseId}/visibility`, {
      visibility,
    });
    return response.data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Không thể thay đổi trạng thái hiển thị";
    throw new Error(msg);
  }
};