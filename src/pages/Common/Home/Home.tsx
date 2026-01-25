import React from "react";
import teacherImage from "@assets/pictures/TeacherHomePage.png";
import { useEffect, useState } from "react";
import { getPublicApprovedCourseCount } from "@/services/Course/courseService";
import {  getStudentCount,  getTeacherCount,} from "@/services/User/userService";

import "./Home.css";

const Home: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalTeachers, setTotalTeachers] = useState<number>(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [courseCount, studentCount, teacherCount] = await Promise.all([
          getPublicApprovedCourseCount(),
          getStudentCount(),
          getTeacherCount(),
        ]);

        setTotalCourses(courseCount);
        setTotalStudents(studentCount);
        setTotalTeachers(teacherCount);
      } catch (err) {
        console.error("Tải dữ liệu thống kê thất bại", err);
      }
    };

    fetchStatistics();
  }, []);


  return (
    <div className="home-container">
      {/* Hero section */}
      <div className="hero-section">
        {/* Left content */}
        <div className="hero-left">
          <h1>
            Học <span className="highlight">Online</span> sẽ trở nên <br />dễ dàng
          </h1>
          <p>
            EdTech là nền tảng thú vị giúp bạn học tập theo cách tương tác hơn
          </p>
          <div className="hero-buttons">
            <button className="btn-join">Tham gia</button>
            <button className="btn-watch">
              <span className="play-circle">▶</span>
              <span>Xem cách hoạt động</span>
            </button>
          </div>
        </div>

        {/* Right content */}
        <div className="hero-right">
          <img src={teacherImage} alt="Teacher" className="teacher-img" />

          {/* Floating card 1 */}
          <div className="card card-1">
            <div className="card-content">
              <div className="card-icon">📘</div>
              <div className="card-text">
                <p className="card-number">{totalStudents}</p>
                <p className="card-title">Học sinh được hỗ trợ</p>
              </div>
            </div>
          </div>

          {/* Floating card 2 */}
          <div className="card card-2">
            <p className="card-title">Chúc mừng</p>
            <p className="card-subtitle">Bạn đã hoàn thành một khóa học 🎉</p>
          </div>

          {/* Floating card 3 */}
          <div className="card card-3">
            <div className="card-content">
              <div className="card-icon">✨</div>
              <div className="card-text">
                <p className="card-subtext">Học để thành công</p>
              </div>
            </div>
          </div>

          {/* Floating card 4*/}
          <div className="card card-4">
            <div className="card-icon">🎓</div>
          </div>

        </div>
      </div>

      {/* Our Success Section */}
      <div className="success-section">
        <div className="success-header">
          <h2>Thành công của chúng tôi</h2>
          <p>
            EdTech đã giúp hàng ngàn học sinh đạt được mục tiêu học tập.
          </p>
        </div>
        <div className="success-stats">
          <div className="stat">
            <h3>{totalStudents}</h3>
            <p>Học viên</p>
          </div>
          <div className="stat">
            <h3>{totalCourses}</h3>
            <p>Khóa học</p>
          </div>
          <div className="stat">
            <h3>{totalTeachers}</h3>
            <p>Chuyên gia hàng đầu</p>
          </div>
          <div className="stat">
            <h3>16</h3>
            <p>Năm kinh nghiệm</p>
          </div>
        </div>
      </div>

      {/* All-in-one Section */}
      <div className="allinone-section">
        <h2>
          Tất cả trong một <span className="highlight">EdTech.</span>
        </h2>
        <p>
          EdTech là một bộ phần mềm trực tuyến mạnh mẽ, tích hợp đầy đủ các công cụ cần thiết để vận hành hiệu quả một trường học hoặc văn phòng.
        </p>

        <div className="allinone-cards">
          <div className="card-item">
            <div className="icon-wrapper" style={{ background: "#5B72EE" }}>
              <span className="icon">📄</span>
            </div>
            <h3>Thanh toán trực tuyến, Lập hóa đơn, & Hợp đồng</h3>
            <p>
              Quản lý đơn giản và an toàn các giao dịch tài chính và pháp lý của tổ chức bạn. Gửi hóa đơn và hợp đồng được tùy chỉnh theo nhu cầu
            </p>
          </div>

          <div className="card-item">
            <div className="icon-wrapper" style={{ background: "#00CBB8" }}>
              <span className="icon">📅</span>
            </div>
            <h3>Lịch trình dễ dàng & Theo dõi điểm danh</h3>
            <p>
              Lên lịch và đặt phòng học tại một khuôn viên hoặc nhiều khuôn viên.
              Ghi lại hồ sơ chi tiết về điểm danh của học sinh.
            </p>
          </div>

          <div className="card-item">
            <div className="icon-wrapper" style={{ background: "#29B9E7" }}>
              <span className="icon">👥</span>
            </div>
            <h3>Theo dõi khách hàng</h3>
            <p>
              Tự động hóa và theo dõi email đến cá nhân hoặc nhóm. Hệ thống tích hợp của Skilline giúp tổ chức bạn dễ dàng quản lý.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
