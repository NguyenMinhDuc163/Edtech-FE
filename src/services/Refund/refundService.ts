import api from "../api";
import type { Refund, RefundsResponse, RefundDetailResponse } from "@/types/Refund/refund.type";

const API_URL = import.meta.env.VITE_API_URL;

interface ApproveRejectResult {
  vnpRequestId: string;
  success: boolean;
  message: string;
}

interface ApproveRejectResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    message: string;
    data: {
      results: ApproveRejectResult[];
    };
  };
}

export const refundService = {
  async getAllRefunds(): Promise<Refund[]> {
    const response = await api.get<RefundsResponse>(`${API_URL}/api/refund/all`);
    return response.data.data.data.refunds || [];
  },

  async getRefundDetail(vnpRequestId: string): Promise<Refund> {
    const response = await api.get<RefundDetailResponse>(`${API_URL}/api/refund/detail/${vnpRequestId}`);
    return response.data.data.data;
  },

  async approveRefunds(vnpRequestIds: string[]): Promise<ApproveRejectResponse["data"]> {
    const response = await api.post<ApproveRejectResponse>(`${API_URL}/api/refund/approve`, {
      vnpRequestIds,
      action: "APPROVE",
    });
    return response.data.data;
  },

  async rejectRefunds(vnpRequestIds: string[], rejectReason: string): Promise<ApproveRejectResponse["data"]> {
    const response = await api.post<ApproveRejectResponse>(`${API_URL}/api/refund/approve`, {
      vnpRequestIds,
      action: "REJECT",
      rejectReason,
    });
    return response.data.data;
  },
};
