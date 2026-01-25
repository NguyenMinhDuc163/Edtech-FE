import type {
  CourseReview,
  ReviewListResponse,
} from "@/types/Course/course_reviews.type";
import "../style/Reviews.css";

interface ReviewsProps {
  reviewList: ReviewListResponse | null;
  isEnrolled: boolean;
}

export function Reviews({ reviewList, isEnrolled }: ReviewsProps) {
  return (
    <div className="review-box">
      <div className="reviews-section">
        {reviewList?.reviews?.length ? (
          reviewList.reviews.map((review: CourseReview) => (
            <div className="review-item" key={review.review_id}>
              <div className="review-header">
                <strong className="review-user">
                  {review.user?.username || "Người dùng ẩn danh"}
                </strong>

                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= review.rating ? "star filled" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {review.title && <h4 className="review-title">{review.title}</h4>}

              <p className="review-content">
                {review.content || "Không có nội dung đánh giá."}
              </p>
            </div>
          ))
        ) : isEnrolled ? (
          <p>Chưa có đánh giá nào cho khóa học này.</p>
        ) : null}
      </div>
    </div>
  );
}
