import api from "@/services/api";
import type {
  CourseReviewStats,
  ReviewListResponse,
  ReviewDto,
  CourseReview,
} from "@/types/Course/course_reviews.type";

export type ReviewQuery = {
  page?: number;
  limit?: number;
};

export const reviewService = {
  async getReviewCourse(
    courseId: number,
    params?: ReviewQuery
  ): Promise<ReviewListResponse> {
    const response = await api.get(`/courses/${courseId}/reviews`, { params });

    const data = response.data?.data;

    return {
      reviews: data?.reviews,
      pagination: data?.pagination,
    };
  },

  async getReviewStatsCourse(courseId: number): Promise<CourseReviewStats> {
    const response = await api.get(`/courses/${courseId}/reviews/stats`);
    return response.data.data;
  },

  async addReview(courseId: number, data: ReviewDto) {
    const response = await api.post(`/courses/${courseId}/reviews`, data);
    return response.data.data;
  },

  async getMyReview(courseId: number): Promise<CourseReview> {
    const response = await api.get(`/courses/${courseId}/reviews/my`);
    return response.data.data;
  },

  async deleteReview(reviewId: number) {
    const response = await api.delete(`/courses/reviews/${reviewId}`);
    return response.data;
  }
};
