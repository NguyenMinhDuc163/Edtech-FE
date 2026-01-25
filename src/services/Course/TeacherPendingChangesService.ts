import api from "@/services/api";
import type { PendingHistoryParams } from "@/types/Course/PendingHistoryParams";

export const getTeacherPendingChanges = async () => {
  const response = await api.get("/pending-changes/teacher/my");
  return response.data.data;
};

export const submitPendingChangeForReview = async (pendingChangeId: string) => {
  const response = await api.post(`/pending-changes/${pendingChangeId}/submit`);
  return response.data;
};


export const getPendingChangeDetail = async (pendingChangeId: string) => {
  const response = await api.get(`/pending-changes/${pendingChangeId}`);
  return response.data?.data;
};

export const getCoursePendingHistory = async ({
  courseId,
  page = 1,
  limit = 20,
  includeDraft,
}: PendingHistoryParams) => {
  const params: any = { page, limit };
  if (includeDraft !== undefined) {
    params.includeDraft = includeDraft;
  }

  const response = await api.get(`/pending-changes/course/${courseId}/history`, {
    params,
  });

  return response.data.data;
};

export const resubmitRejectedChange = async (pendingChangeId: string) => {
  const response = await api.post(`/pending-changes/${pendingChangeId}/resubmit`);
  return response.data;
};

export const updateDraftChange = async (
  courseId: string,
  changeData: {
    type: "UPDATE_SECTION" | "UPDATE_CONTENT";
    target_id: string; 
    data: Partial<{
      title: string;
      description: string;
      is_preview: "Y" | "N";
      order_index?: number;
    }>;
  }
) => {
  const response = await api.post("/pending-changes", {
    courseId,
    changeData,
  });
  return response.data;
};

export const updateSectionInDraft = async (draftId: string, tempId: string, updates: any) => {
  return api.patch(`/pending-changes/${draftId}/section/${tempId}`, updates);
};

export const updateLessonInDraft = async (draftId: string, tempId: string, updates: any) => {
  return api.patch(`/pending-changes/${draftId}/lesson/${tempId}`, updates);
};

export const deletePendingChange = async (pendingChangeId: string) => {
  const response = await api.delete(`/pending-changes/${pendingChangeId}`);
  return response.data;
};