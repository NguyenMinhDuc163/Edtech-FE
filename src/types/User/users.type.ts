export interface Certificate {
  id: string;
  title: string;
  description?: string;
  issued_by: string;
  issued_at: string;
  expires_at?: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  full_name?: string;
  phone?: string;
  grade?: string;
  subject_specialty?: string;
  certificates?: Certificate[];
  is_active?: boolean;
}

export interface UpdateUser {
  avatar?: string;
  full_name?: string;
  phone?: string;
  grade?: string;
  subject_specialty?: string;
}
export interface StudentCountResponse {
  status: number;
  message: string;
  data: {
    students: number;
  };
}

export interface TeacherCountResponse {
  status: number;
  message: string;
  data: {
    teachers: number;
  };
}
