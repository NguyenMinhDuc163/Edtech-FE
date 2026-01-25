import type { CourseDetail } from "@/types/Course/course_detail.type";
import { FaCheckCircle } from "react-icons/fa";
import "../style/PriceBox.css";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { useState } from "react";
import RefundModal from "@/components/RefundModal/RefundModal";
import { courseService } from "@/services/Course/courseService";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { calculateDiscountedPrice } from "@/utils/helper/calculateDiscountedPrice";

interface PriceBoxProps {
  course: CourseDetail;
  onCheckoutClick: () => void;
}

export function PriceBox({ course, onCheckoutClick }: PriceBoxProps) {
  const isEnrolled = course.accessLevel === "FULL";
  const [showRefundModal, setShowRefundModal] = useState(false);
  const { showToast } = useToast();

  const canRefund = isEnrolled && course.daysLeftToCancel && course.daysLeftToCancel > 0;

  const handleRefundRequest = async (reason: string) => {
    try {
      const response = await courseService.createRefund(course.courseId, reason);

      if (response.status === 201 && response.data.success) {
        showToast(response.data.message, "success");
        setShowRefundModal(false);
        window.location.reload();
      } else {
        showToast("Có lỗi xảy ra khi gửi yêu cầu hoàn tiền", "error");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Không thể gửi yêu cầu hoàn tiền";
      showToast(errorMessage, "error");
    }
  };

  return (
    <div className="price-box">
      <img
        src={course.thumbnailUrl}
        alt={course.title}
        className="price-thumb"
      />

      <div className="course-price-info">
        <div className="course-price-row">
          <span className="course-price-current">
            {course.price ? `${formatCurrency(calculateDiscountedPrice(course.price, course.discountAmount), course.currency)}` : "Miễn phí"}
          </span>
          {course.price && (
            <span className="price-old">
              {formatCurrency(Number(course.price), course.currency)}
            </span>
          )}
          {course.discountAmount && (
            <span className="price-discount">Giảm {(course.discountAmount)}%</span>
          )}
        </div>

        <div className="course-meta-info">
          <div className="course-meta-row">
            <span className="course-meta-label">Giờ học:</span>
            <span className="course-meta-value">
              {course.courseDuration || "Chưa cập nhật"}
            </span>
          </div>
          <div className="course-meta-row">
            <span className="course-meta-label">Số lượng bài giảng:</span>
            <span className="course-meta-value">
              {course.sections?.reduce(
                (sum, sec) => sum + (sec.contents?.length || 0),
                0
              ) || 0}
            </span>
          </div>
          <div className="course-meta-row">
            <span className="course-meta-label">Giảng viên:</span>
            <span className="course-meta-value">
              {course.teacher || "Chưa cập nhật"}
            </span>
          </div>
        </div>

        <div className="action-row">
          {isEnrolled ? (
            <>
              <div className="enrolled-badge">
                <FaCheckCircle className="enrolled-icon" />
                Bạn đã sở hữu khóa học này
              </div>
              {canRefund && (
                <div className="refund-section">
                  <p className="refund-notice">
                    Còn <strong>{course.daysLeftToCancel} ngày</strong> để yêu cầu hoàn tiền
                  </p>
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="refund-btn"
                  >
                    Yêu cầu hoàn tiền
                  </button>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => onCheckoutClick()} className="buy-btn">
              Mua ngay
            </button>
          )}
        </div>
      </div>

      {canRefund && (
        <RefundModal
          open={showRefundModal}
          daysLeft={course.daysLeftToCancel || 0}
          onConfirm={handleRefundRequest}
          onCancel={() => setShowRefundModal(false)}
        />
      )}
    </div>
  );
}
