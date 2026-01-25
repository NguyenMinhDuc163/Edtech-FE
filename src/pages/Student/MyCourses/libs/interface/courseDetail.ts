import type { CourseFile } from "@/types/Course/course_detail.type";

export type AdaptiveStatus = "NEUTRAL" | "MASTERED" | "WARNING" | "RECOMMENDED";

export interface CourseContent {
  content_id: string;
  title: string;
  description: string;
  courses_id: string;
  section_id: string;
  files: CourseFile[];
  mastery_level: number;
  adaptive_status: AdaptiveStatus;
  isCompleted?: boolean;
}

export interface CourseSection {
  sectionId: string;
  title: string;
  description: string;
  orderIndex: number;
  contents: CourseContent[];
}

export interface PurchasedCourseDetail {
  courseId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  progress: string;
  sections: CourseSection[];
}
