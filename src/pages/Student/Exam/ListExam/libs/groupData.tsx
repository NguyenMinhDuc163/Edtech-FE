import type { ExamListItemType } from "@/types/Exam/examList.type";

type GroupedExams = {
  [sectionId: string]: {
    sectionTitle: string;
    sectionOrder?: number;
    lessons: {
      [lessonId: string]: {
        lessonTitle: string;
        exams: ExamListItemType[];
      };
    };
  };
};

export const groupExamsByStructure = (exams: ExamListItemType[]) => {
  const grouped: GroupedExams = {};

  exams.forEach((exam) => {
    const { sectionId, sectionTitle, lessonId, lessonTitle } = exam.courseInfo;

    if (!grouped[sectionId]) {
      grouped[sectionId] = {
        sectionTitle: sectionTitle || "Chương chung",
        lessons: {},
      };
    }

    const currentLessonId = lessonId || "unknown_lesson";
    const currentLessonTitle = lessonTitle || "Bài kiểm tra chương";

    if (!grouped[sectionId].lessons[currentLessonId]) {
      grouped[sectionId].lessons[currentLessonId] = {
        lessonTitle: currentLessonTitle,
        exams: [],
      };
    }

    grouped[sectionId].lessons[currentLessonId].exams.push(exam);
  });

  return grouped;
};
