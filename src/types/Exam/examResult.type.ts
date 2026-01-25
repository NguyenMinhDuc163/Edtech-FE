export interface ExamInfo {
  id: string;
  title: string;
  examType: "TEST" | "PRACTICE";
}

export interface StudentInfo {
  id: string;
  user: {
    fullname: string;
  };
}

export interface ExamResultMark {
  id: string;
  score: number;
  correctTotal: number;
  questionTotal: number;
  startedAt: string;
  savedAt: string;
  exam: ExamInfo;
  student: StudentInfo;
}
