export interface Answer {
  answerId: string;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  questionId: string;
  questionText: string;
  questionType: string;
  answers: Answer[];
}

export interface QuizInfo {
  quizId: string;
  quizTitle: string;
  quizDescription: string;
  quizType: string;
  status: string;
  passingScore: string;
  maxAttempts: number;
  isRandomOrder: boolean;
  isShuffleAnswers: boolean;
  startTime: string | null;
  endTime: string | null;
  isRequired: boolean;
  createdAt: string;
}

export interface QuizDetailResponse {
  quizInfo: QuizInfo;
  questions: Question[];
}
