import { CourseCategory } from "@/types/Course/course.type";

export enum ExamType {
  PRACTICE = "PRACTICE",
  TEST = "TEST",
}

export enum ExamAssignType {
  ALL = "ALL",
  SPECIFIC = "SPECIFIC",
}

export const COURSE_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Bản nháp",
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Bị từ chối",
};

export const COURSE_VISIBILITY_LABEL: Record<string, string> = {
  PUBLIC: "Công khai",
  PRIVATE: "Riêng tư",
};

export const EXAM_TYPE_LABEL: Record<string, string> = {
  ASSIGNMENT: "Bài tập",
  EXAM: "Bài kiểm tra",
  PRACTICE: "Bài tập thực hành",
};

export const COURSE_CATEGORY_LABEL: Record<CourseCategory, string> & {
  DEFAULT: string;
} = {
  PROGRAMMING_FOUNDATION: "Nhập môn lập trình",
  WEB_DEVELOPMENT: "Phát triển Web",
  MOBILE_DEVELOPMENT: "Lập trình Mobile",
  BACKEND_DEVELOPMENT: "Backend",
  FRONTEND_DEVELOPMENT: "Frontend",
  DATA_SCIENCE: "Data Science",
  AI_MACHINE_LEARNING: "AI & Machine Learning",
  DEVOPS_CLOUD: "DevOps & Cloud",
  DATABASE: "Cơ sở dữ liệu",
  SOFTWARE_TESTING: "Kiểm thử phần mềm",
  CYBER_SECURITY: "An ninh mạng",
  CAREER_SOFT_SKILLS: "Kỹ năng nghề IT",
  DEFAULT: "Chưa phân loại",
};
