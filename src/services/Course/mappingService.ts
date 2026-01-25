import api from "../api";

/* ===================== ENUM ===================== */
export enum RelationshipType {
  PREREQUISITE = "PREREQUISITE",
  RELATED = "RELATED",
}

/* ===================== TYPES ===================== */
export interface RelationItem {
  relation_id: string;
  parent_content: {
    content_id: string;
    title: string;
  };
  relation_type: RelationshipType;
  weight: number;
}

export interface FileItem {
  fileId: string;
  title: string;
  url: string;
  fileType: string;
}

export interface ContentItem {
  contentId: string;
  title: string;
  description: string;
  courseId: string;
  sectionId: string;
  sectionTitle: string;
  createdAt: string;
  files: FileItem[];
  globalIndex?: number;
}

export interface CourseContentsResponse {
  contents: ContentItem[];
  courseInfo: {
    courseDuration: string;
    teacher: string;
    thumbnailUrl: string;
    discountAmount: string;
  };
}

export interface GraphResponse {
  allLessons: {
    id: string;
    title: string;
    sectionId: string;
  }[];
  allRelations: {
    parent_id: string;
    child_id: string;
    type: "PREREQUISITE" | "RELATED";
  }[];
}

export const contentMappingService = {
  async getRelations(contentId: string): Promise<any> {
    const response = await api.get(`/content-mapping/${contentId}`);
    return response.data.data;
  },

  async createRelation(data: {
    parent_content_id: string;
    child_content_id: string;
    relation_type: RelationshipType;
    weight?: number;
  }): Promise<void> {
    await api.post("/content-mapping", data);
  },

  async deleteRelation(relationId: string): Promise<void> {
    await api.delete(`/content-mapping/${relationId}`);
  },

  async getCourseContents(courseId: string): Promise<CourseContentsResponse> {
    const response = await api.get(`/contents/course/${courseId}`);
    return response.data.data;
  },

 async getCourseGraph (courseId: string | number): Promise<GraphResponse> {
    const res = await api.get(
      `/content-mapping/graph/${courseId}`
    );
    return res.data.data;
  },
};
