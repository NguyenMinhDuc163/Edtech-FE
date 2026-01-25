import api from "@/services/api";

export const deleteSectionService = async (sectionId: string): Promise<void> => {
  await api.delete(`/sections/${sectionId}`);
};