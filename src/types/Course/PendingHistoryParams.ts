export interface PendingHistoryParams {
  courseId: string;
  page?: number;
  limit?: number;
  status?: string;
  includeDraft?: boolean;
}

export interface SectionNested {
  _uniqueId: any;
  type: "add" | "update";
  temp_id?: string;
  section_id?: string;
  title: string;
  description?: string;
  order_index?: number;
  contents: ContentNested[];
}

export interface ContentNested {
  type: "add" | "update";
  temp_id?: string;
  content_id?: string;
  title: string;
  description?: string;
  files?: any[];
  is_preview: "Y" | "N";
  order_index?: number;
  _uniqueId: string;
}

export interface DraftData {
  id: string;
  status: "draft" | "pending" | "approved" | "rejected";
  changeData: {
    sections: SectionNested[];
  };
  adminComment?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PendingChange {
  id: string;
  status: "draft" | "pending" | "approved" | "rejected";
  changeData: any;
  adminComment: string | null;
  createdAt: string;
  updatedAt: string;
  submittedBy: { username: string };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
}