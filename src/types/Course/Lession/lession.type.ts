
export interface Lession {
  lessonId: string;
  title: string;
  type: string;
  order: number;
  filesCount: number;
  description?: string;
  is_preview?: "Y" | "N";
  section_temp_id?: string;
  temp_id?: string;
}

export interface CreateLessonPayload {
  course_id: string;
  section_id: string;
  title: string;
  description?: string;
  is_preview?: "Y" | "N";
  files?: File[];
}