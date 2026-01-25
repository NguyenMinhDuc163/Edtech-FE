export interface Answer {
  answerId: string;
  content: string;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: string;
  timeLimitSec: number;
  answers: Answer[];
}

export interface QuizInfo {
  quizId: string;
  quizTitle: string;
  quizDescription: string;
  quizType: string;
  passingScore: string;
  maxAttempts: number;
  remainingAttempts: number;
  startTime: string | null;
  endTime: string | null;
  isRequired: boolean;
}

export interface Exam {
  quizInfo: QuizInfo;
  questions: Question[];
}

export interface ExamAttemptResponse {
  attemptId: string;
  quizInfo: QuizInfo;
  questions: Question[];
}

export interface ExamAnswer {
  questionId: string;
  answerId: string | null;
}

export interface ExamResult {
  id: string;
  score?: number;
}

export interface User {
  name?: string;
}

export interface QuestionResult {
  questionId: string;
  questionText: string;
  userAnswer: { answerId: string | null; textAnswer: string | null };
  correctAnswerId: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: string;
}

export interface ExamHistoryItem {
  resultId: string;
  attemptId: string;
  attemptNumber: number;
  status: string;
  score: string;
  isPassed: boolean;
  startedAt: string;
  completedAt: string;
  timeSpentMinutes: number;
}

export interface ExamViewData {
  attemptId: string;
  quizInfo: QuizInfo;
  questions: Question[];
}

export interface GetExamsPayload {
  courseId: string;
}

export interface ExamItem {
  quizId: string;
  quizTitle: string;
  quizType: string;
  questionType: string;
  status: string;
  totalQuestions: number;
  passingScore: string;
  maxAttempts: number;
  createdAt: string;
}
