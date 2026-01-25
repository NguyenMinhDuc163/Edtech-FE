export enum FileType {
  VIDEO = 'video',
  PDF = 'pdf',
  TEXT = 'text',
  QUIZ = 'quiz',
  IMAGE = 'image',
  AUDIO = 'audio',
  DOCUMENT = 'document'
}
export interface CourseFile {
  fileId: number;
  title: string;
  fileType: FileType;
  isPreview: boolean;
  url: string;
}

export interface CourseQuiz {
  questionBankId: number;
  quizTitle: string;
}

export interface CourseContent {
  contentId: number;
  title: string;
  description: string;
  isPreview: boolean;
  files: CourseFile[];
  quiz: CourseQuiz;
}

export interface CourseSection {
  sectionId: number;
  title: string;
  description: string;
  orderIndex: number;
  contents: CourseContent[];
}

export interface CourseDetail {
  courseId: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  isPaid: boolean;
  accessLevel: "FREE" | "FULL";
  progress: number;
  sections: CourseSection[];
  teacher: string;
  courseDuration: string;
  thumbnailUrl: string;
  discountAmount: number;
  daysLeftToCancel?: number;
}
