export interface CourseInfo {
  courseId: string;
  courseTitle: string;
  sectionId: string;
  sectionTitle: string;
  lessonId: string;
  lessonTitle: string;
}

export interface ExamListItemType {
  quizId: string;
  quizTitle: string;
  quizDescription: string;
  quizType: string;
  passingScore: string;
  maxAttempts: number;
  startTime: string | null;
  endTime: string | null;
  isRequired: boolean;
  courseInfo: CourseInfo;
}
