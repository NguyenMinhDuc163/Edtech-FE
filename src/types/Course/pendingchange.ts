export interface PendingChange {
  pendingChangeId: string;
  courseId: string;
  courseTitle: string;
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  changeData: {
    addSections?: any[];
    addContents?: any[];
    updateSections?: Record<string, any>;
    updateContents?: Record<string, any>;
  };
}
