import api from "@/services/api";
import type { GetExamsPayload } from "@/types/Exam/exam.type";
import type { examDataPayload } from "@/types/Exam/examCreate.type";
import type { QuizDetailResponse } from "@/types/Exam/examDetail.type";
import type { AddQuestionsPayload } from "@/types/Exam/Question/question.type";

export const teacherExamService = {
  async createExam(examData: examDataPayload): Promise<any> {
    try {
      const response = await api.post("/quizzes", examData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async addQuestion(questionData: AddQuestionsPayload): Promise<any> {
    try {
      const response = await api.post("/quizzes/add-questions", questionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getExams(getExamsPayload: GetExamsPayload): Promise<any> {
    try {
      const response = await api.post("/quizzes/by-course", getExamsPayload);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async getExamById(examId: string): Promise<QuizDetailResponse> {
    try {
      const response = await api.get(`/quizzes/${examId}`);
      return response.data.data.data;
    } catch (error) {
      throw error;
    }
  },

  async downloadTemplate(): Promise<any> {
    try {
      const response = await api.get("/quizzes/download-template", {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  async importQuestions(quizId: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(
        `/quizzes/import-questions?quizId=${quizId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
