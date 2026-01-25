import api from "@/services/api";
import type { CourseContent } from "@/types/Course/course.type";
import type { CreateLessonPayload } from "@/types/Course/Lession/lession.type";

export const getLessonsBySectionService = async (
  sectionId: string
): Promise<CourseContent[]> => {
  try {
    const response = await api.get(`/contents/section/${sectionId}`);
    return response.data?.data || [];
  } catch (error: any) {
    console.error(
      "Error fetching lessons by section:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createLessonService = async (
  payload: CreateLessonPayload
): Promise<CourseContent> => {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("course_id", payload.course_id);
  formData.append("section_id", payload.section_id);
  formData.append("is_preview", payload.is_preview || "N");

  if (payload.description) {
    formData.append("description", payload.description);
  }

  payload.files?.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await api.post("/contents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data?.data;
  } catch (error: any) {
    console.error("Error creating lesson:", error.response?.data || error.message);
    throw error;
  }
};