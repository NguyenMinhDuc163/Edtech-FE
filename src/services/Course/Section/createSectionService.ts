import api from "@/services/api";
import type { CreateSectionPayload } from "@/types/Course/Section/section.type";

export const createSectionService = async (data: CreateSectionPayload) => {
  const payload = {
    title: data.title,
    description: data.description,
    order_index: Number(data.order_index),
    course_id: String(data.course_id),
  };

  try {
    const response = await api.post("/sections", payload);

    if (response.data?.message?.includes?.("tồn tại") || response.data?.error) {
      throw new Error(response.data.message || "Thêm chương thất bại");
    }

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Thêm chương thất bại";


    throw new Error(errorMessage);
  }
};