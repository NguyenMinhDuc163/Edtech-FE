export interface Answer {
  content: string;
  is_correct: boolean;
}

export interface Question {
  question_text: string;
  time_limit_sec: number;
  answers: Answer[];
}

export interface AddQuestionsPayload {
  quiz_id: string;
  questions: Question[];
}
