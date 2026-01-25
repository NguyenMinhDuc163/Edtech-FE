export interface SystemParameter {
  param_id: string;
  param_key: string;
  param_value: string;
  description: string;
  function_name: string;
  created_at: string;
  updated_at: string;
}

export interface SystemParameterPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemParameterResponse {
  data: SystemParameter[];
  pagination: SystemParameterPagination;
}

export interface SystemParameterFilterParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ParameterInput {
  param_key: string;
  param_value: string;
  description: string;
  function_name: string;
}

export interface ParameterUpdateInput extends ParameterInput {
  param_id: string;
}

export interface CreateParameterRequest {
  parameters: ParameterInput[];
}

export interface UpdateParameterRequest {
  parameters: ParameterUpdateInput[];
}

export interface DeleteParameterRequest {
  param_ids: string[];
}

export interface CreateParameterResponse {
  success: boolean;
  data: {
    created: SystemParameter[];
    errors: any[];
  };
  message: string;
}

export interface UpdateParameterResponse {
  success: boolean;
  data: {
    updated: SystemParameter[];
    errors: any[];
  };
  message: string;
}

export interface DeleteParameterResponse {
  success: boolean;
  data: {
    deleted: string[];
    errors: any[];
  };
  message: string;
}
