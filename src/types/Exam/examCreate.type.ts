import type {
  QuestionType,
  QuizType,
} from "@/pages/Teacher/Exam/CreateExam/libs/constant";

export interface examDataPayload {
  quiz_title: string;
  course_content: string;
  quiz_type: QuizType;
  question_type: QuestionType;
  quiz_description: string;
  max_attempts: number;
  passing_score: number;
  is_random_order: boolean;
  is_shuffle_answers: boolean;
  is_required: boolean;
}
