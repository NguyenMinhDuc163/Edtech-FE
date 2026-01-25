export interface PaymentUser {
  user_id: string;
  email: string;
  full_name: string;
}

export interface PaymentCourse {
  course_id: string;
  title: string;
  price: string;
  thumbnail_url: string;
  teacher: string;
}

export interface LatestRefund {
  refund_id: string;
  amount: string;
  status: string;
  created_at: string;
}

export interface RefundInfo {
  total_refunded: string;
  refund_count: number;
  latest_refund: LatestRefund | null;
}

export interface Payment {
  payment_id: string;
  txn_ref: string;
  transaction_no: string;
  user: PaymentUser;
  course: PaymentCourse;
  amount: string;
  payment_method: string;
  bank_code: string;
  original_status: string;
  transaction_status: string;
  refund_info: RefundInfo;
  paid_at: string;
  created_at: string;
}

export interface PaymentStatistics {
  total_transactions: number;
  total_amount_success: number;
  total_amount_failed: number;
  total_amount_refunded: number;
  count_by_status: {
    SUCCESS: number;
    FAILED: number;
    PENDING: number;
    CANCELLED: number;
    REFUNDED_FULL: number;
    REFUNDED_PARTIAL: number;
    REFUND_PROCESSING: number;
  };
}

export interface PaymentHistoryResponse {
  statistics: PaymentStatistics;
  payments: Payment[];
}

export interface PaymentFilterParams {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  paymentMethod?: string;
  transactionStatus?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaymentBuyer {
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
}

export interface RefundCreator {
  user_id: string;
  full_name: string;
  email: string;
}

export interface RefundApprover {
  user_id: string;
  full_name: string;
  email: string;
}

export interface Refund {
  refund_id: string;
  vnp_request_id: string;
  vnp_txn_ref: string;
  amount: string;
  transaction_type: string;
  order_info: string;
  reason: string;
  status: string;
  vnp_transaction_date: string;
  vnp_response_id: string | null;
  vnp_transaction_no: string | null;
  response_code: string | null;
  response_message: string | null;
  transaction_status: string | null;
  bank_code: string | null;
  reject_reason: string | null;
  creator: RefundCreator;
  approver: RefundApprover | null;
  approved_at: string | null;
  refunded_at: string | null;
  created_at: string;
}

export interface PaymentDetail {
  payment_id: string;
  txn_ref: string;
  transaction_no: string;
  amount: string;
  payment_method: string;
  status: string;
  bank_code: string;
  paid_at: string;
  created_at: string;
  buyer: PaymentBuyer;
  course: PaymentCourse;
  refunds: Refund[];
}

export interface StudentPayment {
  payment_id: string;
  course_title: string;
  course_price: string;
  thumbnail_url: string;
  amount: string;
  paid_at: string;
  refund_status: string | null;
  vnp_request_id: string | null;
}

export interface MyPaymentsResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    data: {
      payments: StudentPayment[];
    };
  };
}

export interface InvoiceBuyer {
  full_name: string;
  email: string;
  phone: string;
}

export interface InvoiceCourse {
  course_id: string;
  title: string;
  price: string;
  thumbnail_url: string;
  teacher: string;
}

export interface InvoiceRefund {
  refund_id: string;
  amount: string;
  status: string;
  reason: string;
  created_at: string;
}

export interface PaymentInvoice {
  payment_id: string;
  txn_ref: string;
  transaction_no: string;
  amount: string;
  payment_method: string;
  status: string;
  bank_code: string;
  paid_at: string;
  created_at: string;
  buyer: InvoiceBuyer;
  course: InvoiceCourse;
  refunds: InvoiceRefund[];
}

export interface PaymentInvoiceResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    data: {
      invoice: PaymentInvoice;
    };
  };
}
