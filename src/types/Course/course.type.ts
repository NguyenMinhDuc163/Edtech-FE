import type { CourseReview } from "./course_reviews.type";
import type { CourseRatingSummary } from "./course_rating.type";
import type { Section } from "./Section/section.type";
import type { FileType } from "./course_detail.type";

export interface Course {
  courseId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: CourseCategory;
  avatar: string;
  status: string;
  visibility: string;
  courseDuration: string;
  teacher: string;
  price: number | string;
  currency: string;
  discountAmount?: number;
  ratingSummary?: CourseRatingSummary;
  reviews?: CourseReview[];
  isPreview?: string;
  isPaid?: boolean;
  mobileIapEnabled?: boolean;
  contentEnabled?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  courseDescription?: string;
  approved_by?: string;
}

export interface CreateCoursePayload {
  title: string;
  description: string;
  price: number;
  currency: string;
  visibility?: string;
  status?: string;
  courseDuration: string;
  discountAmount?: number;
  courseDescription: string;
  thumbnailUrl?: string;
  category: CourseCategory;
}

export interface CourseDetail {
  courseId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  category: CourseCategory;
  status: string;
  visibility: string;
  courseDuration: string;
  teacher: string;
  discountAmount: string;
  courseDescription: string;
  thumbnailUrl: string;
  createdAt: string;
  sections: Section[];
}

export interface CourseFile {
  fileId: number;
  title: string;
  fileType: FileType;
  isPreview: boolean;
  url: string;
  filename: string;
  fileSize?: string;
  mimeType?: string;
  orderIndex?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface CourseContent {
  contentId: string;
  title: string;
  description: string;
  isPreview: boolean;
  files: CourseFile[];
  sectionTitle: string;
  createdAt: string;
}

export interface PurchasedCourse {
  registrationId: string;
  courseId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  category: string;
  courseDuration: string;
  teacher: string;
  courseDescription: string;
  thumbnailUrl: string;
  progress: string;
  purchaseDate: string;
  amountPaid: string;
}

export enum CourseCategory {
  PROGRAMMING_FOUNDATION = 'PROGRAMMING_FOUNDATION',
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
  BACKEND_DEVELOPMENT = 'BACKEND_DEVELOPMENT',
  FRONTEND_DEVELOPMENT = 'FRONTEND_DEVELOPMENT',
  DATA_SCIENCE = 'DATA_SCIENCE',
  AI_MACHINE_LEARNING = 'AI_MACHINE_LEARNING',
  DEVOPS_CLOUD = 'DEVOPS_CLOUD',
  DATABASE = 'DATABASE',
  SOFTWARE_TESTING = 'SOFTWARE_TESTING',
  CYBER_SECURITY = 'CYBER_SECURITY',
  CAREER_SOFT_SKILLS = 'CAREER_SOFT_SKILLS',
}
