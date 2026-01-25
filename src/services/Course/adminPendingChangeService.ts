import api from "@/services/api";

export interface PendingChange {
  id: string;
  changeData: any;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  course: {
    course_id: string;
    title: string;
  };
  submittedBy: {
    id: string;
    username: string;
    email: string;
  };
}

export const adminPendingChangeService = {
  async getAllPending(): Promise<PendingChange[]> {
    const res = await api.get("/pending-changes/admin/all");
    return res.data?.data?.data || res.data?.data || [];
  },

  async approve(pendingChangeId: string) {
    const res = await api.post(`/pending-changes/admin/${pendingChangeId}/approve`);
    return res.data;
  },

  async reject(pendingChangeId: string, reason: string) {
    const res = await api.post(`/pending-changes/admin/${pendingChangeId}/reject`, { reason });
    return res.data;
  },

  async batchApprove(pendingChangeIds: string[]) {
    return api.post("/pending-changes/batch/approve", {
      pendingChangeIds: pendingChangeIds,
    });
  },

  async batchReject(pendingChangeIds: string[], reason: string) {
    return api.post("/pending-changes/batch/reject", {
      pendingChangeIds: pendingChangeIds, 
      reason: reason
    });
  }
};