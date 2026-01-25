import api from "@/services/api";

export const deleteLessonService = async (contentId: string): Promise<void> => {
  await api.delete(`/contents/${contentId}`);
};