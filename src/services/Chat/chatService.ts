import api from "../api";

export interface Session {
  session_id: string;
  created_at: string;
  last_active_at: string;
  message_count: number;
  first_message: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  token_count?: number | null;
}

export const chatService = {
  sendMessage: async (
    prompt: string,
    session_id?: string,
    course_id?: string,
    content_id?: string
  ) => {
    const payload: any = { prompt };
    if (session_id) {
      payload.session_id = session_id;
    }
    if (course_id) {
      payload.course_id = course_id;
    }
    if (content_id) {
      payload.content_id = content_id;
    }
    const response = await api.post("/chat/ai", payload, { skipLoading: true });
    if (response.data.status !== 500) {
      return response.data.data;
    } else {
      return {
        id: "1",
        content: "Hệ thống đang bảo trì hoặc gặp sự cố. Vui lòng thử lại sau.",
      };
    }
  },

  getSessions: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/chat/sessions?page=${page}&limit=${limit}`
    );
    return response.data.data;
  },

  getSessionMessages: async (sessionId: string, limit = 50) => {
    const response = await api.get(
      `/chat/sessions/${sessionId}/messages?limit=${limit}`
    );
    return response.data.data;
  },

  deleteSession: async (session_id: string) => {
    const response = await api.delete("/chat/sessions", {
      data: { session_id }
    });
    return response.data;
  }
};
