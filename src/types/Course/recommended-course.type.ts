export type RecommendedCourse = {
  courseId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  teacher: string;
  price: number;
  currency: string;
  discountAmount?: number;
  rating: number;
};