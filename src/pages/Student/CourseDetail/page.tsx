import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useAuthStore } from "../../../store/authStore";
import "./page.css";
import type {
  CourseReview,
  CourseReviewStats,
  ReviewListResponse,
} from "@/types/Course/course_reviews.type";
import { reviewService } from "@/services/Course/Review/course-reviewService";
import { courseService } from "@/services/Course/courseService";
import type { CourseDetail } from "@/types/Course/course_detail.type";
import { Overview } from "./components/Overview";
import { Reviews } from "./components/Reviews";
import { PriceBox } from "./components/PriceBox";
import { Pagination } from "@/components/Pagination/PaginationForRevview";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { useLoadingStore } from "@/store/loadingStore";
import SkeletonCourseList from "@/components/NotFoundData/notFound";
import { FormattedText } from "@/utils/ui/formatText/formattext";
import type { LeaderboardItem } from "./components/LeaderboardWidget";
import { studentExamService } from "@/services/Exam/Student/studentExamService";
import LeaderboardWidget from "./components/LeaderboardWidget";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userId = useAuthStore.getState().userId;
  const { showToast } = useToast();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [reviewList, setReviewList] = useState<ReviewListResponse | null>(null);
  const [reviewStats, setReviewStats] = useState<CourseReviewStats | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "reviews" | "leaderboard"
  >("overview");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [myReview, setMyReview] = useState<CourseReview | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const loading = useLoadingStore((state) => state.isLoading);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);

  const fetchDataReview = async (pageNumber = page) => {
    try {
      if (!courseId) return;
      setLoading(true);
      const res = await reviewService.getReviewCourse(Number(courseId), {
        page: pageNumber,
        limit,
      });

      setReviewList(res);
      setTotalPages(res?.pagination?.totalPages || 1);
      setPage(pageNumber);

      const myRes = await reviewService.getMyReview(Number(courseId));
      setMyReview(myRes || null);

      if (myRes) {
        setRating(myRes.rating);
        setTitle(myRes.title);
        setContent(myRes.content);
      }
    } catch (err) {
      showToast("Có lỗi trong quá trình lấy bình luận", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (courseId: number) => {
    if (!title || !content) {
      showToast("Vui lòng điền đầy đủ thông tin!", "warning");
      return;
    }

    try {
      setLoading(true);
      if (myReview) {
        await reviewService.addReview(courseId, {
          rating,
          title,
          content,
        });
      } else {
        await reviewService.addReview(courseId, {
          rating,
          title,
          content,
        });
      }

      await fetchDataReview();
      setShowForm(false);
    } catch (err) {
      showToast("Có lỗi khi gửi đánh giá", "error");
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!courseId || !myReview) return;

    try {
      const res = await reviewService.deleteReview(myReview.review_id);
      if (res?.status === "200") {
        showToast("Xóa đánh giá thành công!", "success");
      } else {
        showToast("Xóa đánh giá thành công!", "success");
      }

      setShowDeleteConfirm(false);
      setRating(5);
      setTitle("");
      setContent("");

      setMyReview(null);

      await fetchDataReview();
      setShowForm(false);
    } catch (err) {
      console.error("Error deleting review", err);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseService.getCourseById(Number(courseId));
        setCourse(res);
      } catch (err) {
        showToast("Có lỗi trong quá trình lấy dữ liệu", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchReview = async () => {
      try {
        if (!courseId) return;
        setLoading(true);
        const reviewStatsResponse = await reviewService.getReviewStatsCourse(
          Number(courseId)
        );
        setReviewStats(reviewStatsResponse);
      } catch (error) {
        showToast("Có lỗi trong quá trình lấy dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchDataReview();
    fetchReview();
    fetchCourses();
  }, [courseId]);

  useEffect(() => {
    if (reviewList?.reviews && userId) {
      const found = reviewList.reviews.find(
        (r) => r.user?.id === Number(userId)
      );
      setMyReview(found || null);

      if (found) {
        setRating(found.rating);
        setTitle(found.title);
        setContent(found.content);
      }
    }
  }, [reviewList]);

  useEffect(() => {
    if (!courseId) return;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        const response = await studentExamService.getLeaderboard(courseId);

        const data = response?.leaderboard || response?.data?.leaderboard || [];

        setLeaderboardData(data);
      } catch (err) {
        showToast("Có lỗi trong quá trình lấy bảng xếp hạng!", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [courseId]);

  const top10Leaderboard = useMemo(() => {
    return leaderboardData.slice(0, 10);
  }, [leaderboardData]);

  const handleCheckoutClick = () => {
    navigate(`/student/checkout?courseId=${course?.courseId}`);
  };

  const handleExamListClick = () => {
    navigate(`/student/course/${courseId}/exams`, {
      state: {
        courseTitle: course?.title,
      },
    });
  };

  if (loading) {
    return <SkeletonCourseList count={8} />;
  }

  if (!course) {
    return <div className="not-found">Course not found</div>;
  }

  const isEnrolled = course.accessLevel === "FULL";

  return (
    <div className="student-course-detail-container">
      <div className="student-course-section">
        <div className="hero-content">
          <h1>{course.title}</h1>
          <FormattedText maxLength={500} content={course.description} />

          <div className="hero-badges">
            <div className="rating">
              <span>{reviewStats?.averageRating?.toFixed(1)}</span>
              <span>⭐</span>
              <div className="student-course-stat-item">
                <span>{reviewStats?.totalReviews ?? 0} Lượt đánh giá</span>
              </div>
            </div>
          </div>

          <div className="hero-meta">
            <div>
              <strong>Giảng viên:</strong> {course.teacher || "Đang cập nhật"}
            </div>
            <div>
              <strong>Trạng thái:</strong>{" "}
              {course.isPaid ? "Khóa học trả phí" : "Khóa học miễn phí"}
            </div>
            <div>
              <strong>Giá:</strong>{" "}
              {course.isPaid
                ? `${formatCurrency(Number(course.price), course.currency)}`
                : "Miễn phí"}
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="left-column">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>

            <button
              className={`tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
            <button
              className={`tab ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              Bảng xếp hạng
            </button>
            <button className="tab" onClick={() => handleExamListClick()}>
              Bài thi
            </button>
          </div>

          {activeTab === "overview" && <Overview course={course} />}

          {activeTab === "reviews" && (
            <>
              {isEnrolled && !showForm && (
                <button
                  className="review-toggle-btn"
                  onClick={() => setShowForm(true)}
                >
                  {myReview ? "Chỉnh sửa đánh giá" : "Viết đánh giá"}
                </button>
              )}

              {!isEnrolled && !showForm && (
                <p className="review-locked-text">
                  Bạn cần mua khóa học để viết đánh giá.
                </p>
              )}
              {isEnrolled && showForm && (
                <div className="review-form">
                  <h3>
                    {myReview
                      ? "Chỉnh sửa đánh giá của bạn"
                      : "Đánh giá khóa học"}
                  </h3>

                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= (hoverRating || rating)
                            ? "star filled"
                            : "star"
                        }
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Tiêu đề đánh giá..."
                    className="review-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <textarea
                    placeholder="Nội dung đánh giá..."
                    className="review-textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>

                  <div className="review-action-row">
                    <button
                      className="review-submit-btn"
                      onClick={() => handleSubmitComment(Number(courseId))}
                    >
                      {myReview ? "Cập nhật" : "Gửi đánh giá"}
                    </button>

                    {myReview && (
                      <button
                        className="review-submit-btn"
                        onClick={() => {
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Xóa
                      </button>
                    )}

                    <button
                      className="review-cancel-btn"
                      onClick={() => setShowForm(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <Reviews reviewList={reviewList} isEnrolled={isEnrolled} />

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(newPage) => fetchDataReview(newPage)}
              />

              <ConfirmDialog
                open={showDeleteConfirm}
                title="Xóa đánh giá"
                message="Bạn có chắc chắn muốn xóa đánh giá này không?"
                onConfirm={handleDeleteReview}
                onCancel={() => setShowDeleteConfirm(false)}
              />
            </>
          )}

          {activeTab === "leaderboard" && (
            <LeaderboardWidget
              data={top10Leaderboard}
              title="Top Học Viên Khóa Này"
              currentStudentId={userId}
            />
          )}
        </div>

        <div className="right-column">
          <PriceBox course={course} onCheckoutClick={handleCheckoutClick} />

          <div className="share-section">
            <h3>Share this course</h3>
            <div className="social-icons">
              <i className="fab fa-facebook">
                <FaFacebook />
              </i>
              <i className="fab fa-twitter">
                <FaTwitter />
              </i>
              <i className="fab fa-linkedin">
                <FaLinkedin />
              </i>
              <i className="fab fa-instagram">
                <FaInstagram />
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
