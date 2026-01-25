import api from "@/services/api";

export const getSectionsByCourseService = async (courseId: string) => {
  try {
    const response = await api.get(`/sections/course/${courseId}`);

    return response.data?.data || [];
  } catch (error: any) {
    console.error(
      "❌ Error fetching sections:",
      error.response?.data || error.message
    );
    throw error;
  }
};
