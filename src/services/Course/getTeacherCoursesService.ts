import api from "@/services/api";

export const getUserCourses = async (): Promise<any> => {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user courses:", error);
    throw error;
  }
};
