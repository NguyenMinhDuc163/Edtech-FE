import api from "@/services/api";
import type {
  GetDetailDto,
  GetExamsDto,
  SubmitExamDto,
} from "../libs/interface/dto.interface";

export const studentExamService = {
  async getAllExams(getExamsDto: GetExamsDto): Promise<any> {
    const response = await api.post("/student/quiz/list", getExamsDto);
    return response.data.data;
  },

  async getDetailExam(getDetailDto: GetDetailDto): Promise<any> {
    const response = await api.post("/student/quiz/detail", getDetailDto);
    return response.data.data;
  },

  async submitExam(data: SubmitExamDto): Promise<any> {
    const response = await api.post("/student/quiz/submit", data);
    return response.data.data;
  },

  async getExamHistory(dto: GetDetailDto): Promise<any> {
    const response = await api.post("/student/quiz/history", dto);
    return response.data.data;
  },

getLeaderboard: async (courseId?: string) => {
  // Nếu courseId null/undefined thì không gửi lên params, hoặc gửi null tùy BE quy định
  const params = courseId ? { courseId } : {}; 
  
  const res= await api.get('/quizzes/leaderboard', { params });
      return res.data.data;
}
};
