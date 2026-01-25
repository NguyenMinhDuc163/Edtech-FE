import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./style/ConfirmOrderPage.css";
import { userService } from "@/services/User/userService";
import { courseService } from "@/services/Course/courseService";
import { paymentService } from "@/services/Payment/paymentService";
import type { User } from "@/types/User/users.type";
import type { CourseDetail } from "@/types/Course/course_detail.type";
import { useLoadingStore } from "@/store/loadingStore";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import { calculateDiscountedPrice } from "@/utils/helper/calculateDiscountedPrice";

export default function ConfirmOrderPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const courseId = params.get("courseId");

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [profileRes, courseRes] = await Promise.all([
          userService.getProfile(),
          courseService.getCourseById(Number(courseId)),
        ]);
        setUser(profileRes);
        setCourse(courseRes);
      } catch (error) {
        console.error("Load data error:", error);
        alert("Không tải được thông tin. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [courseId]);

  const handleProceedPayment = async () => {
    if (!course || !courseId) return;

    try {
      const finalPrice = (course.price || 0) - (course.discountAmount || 0);

      const res = await paymentService.createQrPayment({
        courseId: courseId,
        amount: finalPrice,
      });

      window.location.href = res.paymentUrl;
    } catch (err: any) {
      alert(err.message || "Không thể tạo link thanh toán. Vui lòng thử lại!");
    }
  };

  const handleCancelOrder = () => setShowCancelConfirm(true);
  const confirmCancel = () => {
    localStorage.removeItem("pending_payment_id");
    localStorage.removeItem("pending_course_id");
    navigate(`/student/course/${courseId}`);
  };

  if (!courseId || !course || !user) {
    return (
      <div className="confirm-order-error">
        <h2>Không tìm thấy khóa học</h2>
        <button onClick={() => navigate("/")} className="btn-primary">
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="confirm-order-container">
      <h1>Xác nhận đơn hàng</h1>

      <div className="order-box">
        <h2>Thông tin khóa học</h2>
        <p>
          <strong>Khóa học:</strong> {course.title}
        </p>
        <p>
          <strong>Giá gốc:</strong> {formatCurrency(Number(course.price), course.currency)}
        </p>
        {course.discountAmount > 0 && (
          <p className="discount">
            <strong>Giảm giá:</strong> {course.discountAmount.toLocaleString()}{" "}
            %
          </p>
        )}
        <p className="final-price">
          <strong>Tổng tiền:</strong> {formatCurrency(calculateDiscountedPrice(course.price, course.discountAmount), course.currency)}
        </p>
      </div>

      <div className="order-box">
        <h2>Thông tin thanh toán</h2>
        <p>
          <strong>Họ tên:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <div className="order-actions">
        <button className="btn-primary" onClick={handleProceedPayment}>
          Tiếp tục thanh toán
        </button>
        <button className="payment-btn-cancel" onClick={handleCancelOrder}>
          Hủy đơn hàng
        </button>
      </div>

      {showCancelConfirm && (
        <div
          className="cancel-overlay"
          onClick={() => setShowCancelConfirm(false)}
        >
          <div className="cancel-box" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận hủy đơn hàng?</h3>
            <p>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
            <div className="cancel-actions">
              <button className="btn-confirm-cancel" onClick={confirmCancel}>
                Đồng ý hủy
              </button>
              <button
                className="btn-close-popup"
                onClick={() => setShowCancelConfirm(false)}
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
