interface Student {
  id: string;
  username: string;
}

interface Quiz {
  question_bank_id: string;
  quiz_title: string;
}

export interface CourseResult {
  result_id: string;
  attempt_number: number;
  score: string;
  completed_at: string;
  status: string;
  is_passed: boolean;
  student: Student;
  quiz: Quiz;
}
