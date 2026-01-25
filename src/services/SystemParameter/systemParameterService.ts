import api from "../api";
import type {
  SystemParameterResponse,
  SystemParameterFilterParams,
  CreateParameterRequest,
  UpdateParameterRequest,
  DeleteParameterRequest,
  CreateParameterResponse,
  UpdateParameterResponse,
  DeleteParameterResponse,
} from "@/types/SystemParameter/systemParameter.type";

export const systemParameterService = {
  async getSystemParameters(params?: SystemParameterFilterParams): Promise<{ data: SystemParameterResponse; total: number }> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await api.get(`/admin/system-parameters?${queryParams.toString()}`);
    return {
      data: response.data.data,
      total: response.data.data.pagination.total,
    };
  },

  async createParameters(data: CreateParameterRequest): Promise<CreateParameterResponse> {
    const response = await api.post("/admin/system-parameters", data);
    return response.data;
  },

  async updateParameters(data: UpdateParameterRequest): Promise<UpdateParameterResponse> {
    const response = await api.post("/admin/system-parameters/update", data);
    return response.data;
  },

  async deleteParameters(data: DeleteParameterRequest): Promise<DeleteParameterResponse> {
    const response = await api.post("/admin/system-parameters/delete", data);
    return response.data;
  },
};
