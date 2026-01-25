export type GetExamsDto = {
  course_id: string;
  section_id?: string;
  lesson_id?: string;
};

export type GetDetailDto = {
  quiz_id: string;
};

export type SubmitExamDto = {
  quiz_id: string;
  answers: {
    question_id: string;
    answer_id: string | null;
  }[];
};
