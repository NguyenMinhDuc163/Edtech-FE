import api from "@/services/api";

export const searchService = {
  async searchCourses(
      query: string,
      filters: {
        top_k?: number;
        category?: string;
        price_range?: string;
        teacher?: string;
      } = {}
    ) {
      try {
        const res = await api.get("/search/courses", {
          params: {
            q: query || undefined,
            ...filters,
          },
        });

        const apiData = res.data?.data || [];

        return apiData.map((item: any) => {
          const id = Number(item.courseId) || Number(item.course_id);
          
          if (!id || isNaN(id)) {
            console.warn("Course không có ID hợp lệ:", item);
            return null;
          }

          return {
            courseId: id, 
            title: item.title || "Không có tiêu đề",
            description: item.description || item.courseDescription || "",
            thumbnailUrl: item.thumbnailUrl || item.thumbnail_url || null,
            teacher: item.teacher || "Giảng viên ẩn danh",
            avatar: item.avatar || "/default-avatar.jpg",
            category: item.category || "Chung",
            courseDuration: item.courseDuration || item.course_duration || "Chưa xác định",
            price: Number(item.price) || 0,
            currency: item.currency || "VND",
            discountAmount: item.discountAmount ? Number(item.discountAmount) : null,
          };
        }).filter(Boolean);
      } catch (error: any) {
        console.error("Search error:", error.response?.data || error.message);
        return [];
      }
    },

  async getHistory() {
    try {
      const res = await api.get("/search/history");
      return res.data?.data || [];
    } catch (error: any) {
      console.error("❌ getHistory error:", error.response?.data || error.message);
      return [];
    }
  },

  async deleteHistory(id: number) {
    try {
      const res = await api.delete(`/search/history/${id}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ deleteHistory error:", error.response?.data || error.message);
      throw error;
    }
  },

  async getSuggestions(query: string) {
    if (!query.trim() || query.trim().length < 2) return [];
    
    try {
      const res = await api.get("/search/autocomplete", {
        params: { q: query.trim() },
      });
      return res.data?.data || [];
    } catch (error: any) {
      console.error("Autocomplete error:", error.response?.data || error.message);
      return [];
    }
  },
};
