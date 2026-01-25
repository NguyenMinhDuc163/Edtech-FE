import React, { useState } from "react";
import { createCourse } from "@/services/Course/createCourseService";
import {
  CourseCategory,
  type CreateCoursePayload,
} from "@/types/Course/course.type";
import "./CreateCourse.css";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/Notification/common/ToastProvider";
import { formatCurrency } from "@/utils/helper/formatCurrency";
import defaultThumbnail from "@/assets/pictures/searchbg.jpg";
import { COURSE_CATEGORY_LABEL } from "@/utils/ui/constants";
import { FloatingBackButton } from "@/components/BackButton/FloatingBackButton";

export default function CreateCourse() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<
    Omit<CreateCoursePayload, "discountAmount"> & { discountPercent: number }
  >({
    title: "",
    description: "",
    price: 0,
    currency: "VND",
    visibility: "PUBLIC",
    status: "DRAFT",
    courseDuration: "",
    courseDescription: "",
    category: CourseCategory.PROGRAMMING_FOUNDATION,
    discountPercent: 0,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "price" || name === "discountPercent") {
      const numValue = Number(value.replace(/\D/g, ""));
      setFormData({ ...formData, [name]: numValue >= 0 ? numValue : 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setThumbnailFile(file);
      } else {
        showToast("Vui lòng chỉ tải lên file ảnh", "error");
      }
    }
  };

  const calculateDiscountAmount = () => {
    return formData.price * (formData.discountPercent / 100) || 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || submitSuccess) return;

    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        showToast("Vui lòng nhập Tiêu đề khóa học!", "error");
        return;
      }
      if (!formData.description.trim()) {
        showToast("Vui lòng nhập Mô tả!", "error");
        return;
      }
      if (!formData.courseDuration.trim()) {
        showToast("Vui lòng nhập Thời lượng khóa học!", "error");
        return;
      }
      if (formData.discountPercent < 0 || formData.discountPercent > 100) {
        showToast("Phần trăm giảm giá phải từ 0 đến 100!", "error");

        return;
      }

      if (!formData.category) {
        showToast("Vui lòng chọn danh mục khóa học", "warning");
        return;
      }

      const payload: CreateCoursePayload = {
        ...formData,
        discountAmount: calculateDiscountAmount(),
        price: Number(formData.price),
      };

      const formDataToSend = new FormData();
      formDataToSend.append("title", payload.title);
      formDataToSend.append("description", payload.description);
      formDataToSend.append("price", payload.price.toString());
      formDataToSend.append("currency", payload.currency);
      formDataToSend.append("visibility", payload.visibility || "PUBLIC");
      formDataToSend.append("status", payload.status || "DRAFT");
      formDataToSend.append("courseDuration", payload.courseDuration);
      formDataToSend.append(
        "discountAmount",
        payload.discountAmount?.toString() || "0"
      );
      formDataToSend.append("courseDescription", payload.courseDescription);
      formDataToSend.append("category", payload.category);
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      } else {
        const response = await fetch(defaultThumbnail);
        const blob = await response.blob();

        const defaultFile = new File([blob], "default-thumbnail.jpg", {
          type: blob.type,
        });

        formDataToSend.append("thumbnail", defaultFile);
      }

      const result = await createCourse(formDataToSend);

      if (result?.data?.code === 201 || result?.status === 201) {
        showToast("Khóa học được tạo thành công!", "success");
        setSubmitSuccess(true);

        setTimeout(() => {
          navigate("/teacher/courses");
        }, 1500);

        return;
      } else {
        showToast("Lỗi khi tạo khóa học!", "error");
      }
    } catch (error: any) {
      console.error(error);
      showToast("Lỗi khi tạo khóa học!", "error");
    } finally {
      if (!submitSuccess) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-container">
        <h2>🎓 Tạo Khóa Học Mới</h2>
        <form className="create-course-form" onSubmit={handleSubmit}>
          <label>
            Tiêu đề <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>
            Mô tả <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Mô tả Chi Tiết</label>
          <textarea
            name="courseDescription"
            value={formData.courseDescription}
            onChange={handleChange}
          />

          <label>Chủ đề</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {Object.entries(COURSE_CATEGORY_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label>Giá</label>
          <input
            type="text"
            name="price"
            placeholder="0"
            value={formData.price === 0 ? "" : formatCurrency(formData.price)}
            onChange={handleChange}
          />
          <label>Giảm Giá (0-100%)</label>
          <input
            type="number"
            name="discountPercent"
            value={formData.discountPercent || ""}
            onChange={handleChange}
            min="0"
            max="100"
            placeholder="0"
            inputMode="numeric"
            step="1"
          />
          <p>
            Số Tiền Giảm Giá:{" "}
            {formatCurrency(calculateDiscountAmount(), formData.currency)}
          </p>

          <label>
            Thời Lượng <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="courseDuration"
            value={formData.courseDuration}
            placeholder="VD: 25"
            inputMode="numeric"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "");
              setFormData({ ...formData, courseDuration: onlyNums });
            }}
            required
          />
          <label>Hiển Thị</label>
          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
          >
            <option value="PUBLIC">Công Khai</option>
            <option value="PRIVATE">Riêng Tư</option>
          </select>
          <div className="file-upload-wrapper">
            <label className="file-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <span className="file-upload-btn">
                {thumbnailFile ? thumbnailFile.name : "Chọn ảnh bìa"}
              </span>
            </label>
            {thumbnailFile && (
              <button
                type="button"
                onClick={() => setThumbnailFile(null)}
                className="file-remove-btn"
              >
                Xóa
              </button>
            )}
          </div>
          {thumbnailFile && (
            <div className="thumbnail-preview">
              <img
                src={URL.createObjectURL(thumbnailFile)}
                alt="Ảnh bìa khóa học"
                style={{ width: 200, height: "auto", marginTop: 12 }}
              />
            </div>
          )}
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting || submitSuccess}
            style={{
              opacity: isSubmitting || submitSuccess ? 0.6 : 1,
              cursor: isSubmitting || submitSuccess ? "not-allowed" : "pointer",
            }}
          >
            {submitSuccess
              ? "Đã tạo thành công!"
              : isSubmitting
              ? "Đang tạo khóa học..."
              : "Tạo Khóa Học"}
          </button>
        </form>
      </div>
      <FloatingBackButton/>
    </div>
  );
}
