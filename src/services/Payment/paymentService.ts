import api from "../api";
import type { PaymentHistoryResponse, PaymentFilterParams, PaymentDetail, StudentPayment, PaymentInvoice } from "@/types/Payment/payment.type";

export const paymentService = {
  async createQrPayment(payload: { courseId: string; amount: number }) {
    const response = await api.post("/api/create-qr", payload);
    return response.data.data;
  },

  async getPaymentHistory(params?: PaymentFilterParams): Promise<{ data: PaymentHistoryResponse; total: number }> {
    const queryParams = new URLSearchParams();

    if (params?.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params?.dateTo) queryParams.append("dateTo", params.dateTo);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.paymentMethod) queryParams.append("paymentMethod", params.paymentMethod);
    if (params?.transactionStatus) queryParams.append("transactionStatus", params.transactionStatus);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const response = await api.get(`/api/admin/payments?${queryParams.toString()}`);
    return response.data.data;
  },

  async getPaymentDetail(paymentId: string): Promise<PaymentDetail> {
    const response = await api.get(`/api/admin/payments/${paymentId}`);
    return response.data.data.data;
  },

  async getMyPayments(): Promise<StudentPayment[]> {
    const response = await api.get("/api/my-payments");
    return response.data.data.data.payments;
  },

  async getPaymentInvoice(paymentId: string): Promise<PaymentInvoice> {
    const response = await api.get(`/api/my-payments/${paymentId}`);
    return response.data.data.data.invoice;
  },
};
