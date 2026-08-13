import api from "../api";
import type {
  CreateIapProductPayload,
  IapCourseContentAccess,
  IapGlobalParameter,
  IapStoreProduct,
} from "@/types/Iap/iapAdmin.type";

export const iapAdminService = {
  async getCourses(params?: { page?: number; limit?: number; title?: string }) {
    const response = await api.get("/admin/courses", { params });
    return response.data.data as {
      courses: Array<Record<string, unknown>>;
      pagination: { total: number; page: number; limit: number; totalPages: number };
    };
  },

  async getStoreProducts(courseId: string): Promise<IapStoreProduct[]> {
    const response = await api.get(`/admin/courses/${courseId}/store-products`);
    return response.data.data;
  },

  async createStoreProduct(courseId: string, payload: CreateIapProductPayload) {
    const response = await api.post(
      `/admin/courses/${courseId}/store-products`,
      payload,
    );
    return response.data.data as IapStoreProduct;
  },

  async updateStoreProduct(
    courseId: string,
    mappingId: string,
    payload: { isActive: boolean },
  ) {
    const response = await api.patch(
      `/admin/courses/${courseId}/store-products/${mappingId}`,
      payload,
    );
    return response.data.data as IapStoreProduct;
  },

  async updateCourseIap(
    courseId: string,
    payload: { mobileIapEnabled: boolean; isPaid?: boolean },
  ) {
    const response = await api.patch(
      `/admin/courses/${courseId}/mobile-iap`,
      payload,
    );
    return response.data.data;
  },

  async updateCourseVisibility(
    courseId: string,
    visibility: "PUBLIC" | "PRIVATE",
  ) {
    const response = await api.patch(`/admin/courses/${courseId}/visibility`, {
      visibility,
    });
    return response.data.data;
  },

  async getGlobalIapParameter(): Promise<IapGlobalParameter | null> {
    const response = await api.get("/admin/system-parameters", {
      params: { page: 1, limit: 100 },
    });
    const parameters = response.data.data?.data as IapGlobalParameter[] | undefined;
    return parameters?.find((item) => item.param_key === "MOBILE_IAP_ENABLED") ?? null;
  },

  async updateGlobalIap(parameterId: string, enabled: boolean) {
    const response = await api.post("/admin/system-parameters/update", {
      parameters: [
        {
          param_id: parameterId,
          param_value: enabled ? "Y" : "N",
        },
      ],
    });
    return response.data.data;
  },

  async getContentAccess(courseId: string): Promise<IapCourseContentAccess> {
    const response = await api.get(`/admin/courses/${courseId}/content-access`);
    return response.data.data;
  },

  async updateCourseContentEnabled(courseId: string, enabled: boolean) {
    const response = await api.patch(
      `/admin/courses/${courseId}/content-enabled`,
      { enabled },
    );
    return response.data.data as IapCourseContentAccess;
  },

  async updateSectionAccess(
    courseId: string,
    sectionId: string,
    payload: { isActive?: boolean; isPreview?: boolean },
  ) {
    const response = await api.patch(
      `/admin/courses/${courseId}/sections/${sectionId}/access`,
      payload,
    );
    return response.data.data;
  },

  async updateContentAccess(
    courseId: string,
    contentId: string,
    payload: { isPreview?: boolean; isActive?: boolean },
  ) {
    const response = await api.patch(
      `/admin/courses/${courseId}/contents/${contentId}/access`,
      payload,
    );
    return response.data.data;
  },

  async updateFileAccess(courseId: string, fileId: string, isActive: boolean) {
    const response = await api.patch(
      `/admin/courses/${courseId}/files/${fileId}/access`,
      { isActive },
    );
    return response.data.data;
  },
};
