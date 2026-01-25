import api from "../api";

export const learningApi = {
  updateProgress: (payload: {
    courseId: string;
    contentId: string;
    action: "VIDEO_START" | "VIDEO_WATCHING" | "VIDEO_PAUSE" | "VIDEO_COMPLETE";
    videoTimestamp: number; 
    durationWatched: number; 
    totalDuration: number; 
  }) => {
    return api.post("/learning/progress", payload);
  },

  getCourseProgress: (courseId: string) => {
    return api.get(`/learning/progress/${courseId}`);
  },

  sendBeaconLog: (data: any) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    navigator.sendBeacon(
      `${import.meta.env.VITE_API_URL}/learning/progress`,
      blob
    );
  },

  async getLastViewedContent (courseId: string){
    const res = await api.get(
      `/learning/course/${courseId}/resume`
    );
    return res.data.data;
  }
};
