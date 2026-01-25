export interface Course {
  course_id: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  teacher: string;
  course_duration: string;
  discount_amount: string;
  is_paid: boolean;
  thumbnail_url: string;
}

export interface Payment {
  payment_id: string;
  txn_ref: string;
  user_id: string;
  course_id: string;
  amount: string;
  payment_method: string;
  status: string;
  transaction_no: string;
  bank_code: string;
  response_code: string;
  order_info: string;
  paid_at: string;
  vnp_create_date: string;
  created_at: string;
  course?: Course;
}

export interface Creator {
  id: string;
  username: string;
  full_name: string;
  email: string;
  password: string;
  is_active: boolean;
  avatar_url: string | null;
  phone: string | null;
  grade: string | null;
  subject_specialty: string | null;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  refund_id: string;
  payment_id: string;
  vnp_request_id: string;
  vnp_txn_ref: string;
  amount: string;
  transaction_type: string;
  order_info: string;
  reason: string;
  created_by: string;
  ip_addr: string;
  vnp_transaction_date: string;
  vnp_response_id: string | null;
  response_code: string | null;
  response_message: string | null;
  vnp_transaction_no: string | null;
  transaction_status: string | null;
  bank_code: string | null;
  status: "PEND" | "APPROVED" | "REJECTED";
  reject_reason: string | null;
  approved_by: string | null;
  approved_at: string | null;
  refunded_at: string | null;
  created_at: string;
  payment: Payment;
  creator: Creator;
  approver: Creator | null;
}

export interface RefundsResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    data: {
      refunds: Refund[];
    };
  };
}

export interface RefundDetailResponse {
  status: number;
  message: string;
  data: {
    success: boolean;
    data: Refund;
  };
}
