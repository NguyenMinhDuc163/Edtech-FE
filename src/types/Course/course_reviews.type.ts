export interface ReviewUser {
  id: number;
  username: string;
}

export interface CourseReview {
  review_id: number;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user: ReviewUser;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ReviewListResponse {
  reviews: CourseReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseReviewStats {
  courseId: number;
  averageRating: number;
  totalReviews: number;
  totalComments: number;
}

export interface ReviewDto {
  rating: number,
  title: string;
  content: string;
}