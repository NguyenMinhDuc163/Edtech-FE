import React from "react";
import "./style/About.css";

const About: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>Về EdTech</h1>
          <p className="about-hero-subtitle">
            Nền tảng học trực tuyến hiện đại, kết nối học viên và giảng viên
          </p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <h2>Giới thiệu</h2>
          <p>
            EdTech là nền tảng học tập trực tuyến được xây dựng với mục tiêu mang đến trải nghiệm
            học tập chất lượng cao cho mọi học viên. Chúng tôi kết nối các giảng viên giàu kinh nghiệm
            với những người học đam mê tri thức, tạo nên một cộng đồng học tập năng động và hiệu quả.
          </p>
        </section>

        <section className="about-section">
          <h2>Sứ mệnh</h2>
          <p>
            Chúng tôi cam kết cung cấp giáo dục chất lượng cao, dễ tiếp cận cho mọi người, mọi nơi.
            EdTech tin rằng việc học tập không có giới hạn và mỗi người đều xứng đáng có cơ hội phát triển
            bản thân thông qua kiến thức.
          </p>
        </section>

        <section className="about-section">
          <h2>Tính năng nổi bật</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Kho khóa học phong phú</h3>
              <p>Hàng trăm khóa học từ cơ bản đến nâng cao trong nhiều lĩnh vực khác nhau</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Giảng viên chất lượng</h3>
              <p>Đội ngũ giảng viên giàu kinh nghiệm, tận tâm và nhiệt huyết</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Học tập linh hoạt</h3>
              <p>Học mọi lúc, mọi nơi theo tiến độ phù hợp với bạn</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Theo dõi tiến độ</h3>
              <p>Hệ thống đánh giá và theo dõi tiến độ học tập chi tiết</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Tương tác trực tiếp</h3>
              <p>Giao tiếp với giảng viên và học viên khác qua hệ thống chat</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Chứng chỉ hoàn thành</h3>
              <p>Nhận chứng chỉ sau khi hoàn thành khóa học thành công</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Tầm nhìn</h2>
          <p>
            Trở thành nền tảng giáo dục trực tuyến hàng đầu, nơi mọi người có thể tìm thấy
            và phát triển đam mê của mình. Chúng tôi hướng đến một tương lai nơi giáo dục
            không còn rào cản về địa lý, thời gian hay kinh tế.
          </p>
        </section>

        <section className="about-section stats-section">
          <h2>Con số ấn tượng</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">Học viên</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">100+</div>
              <div className="stat-label">Khóa học</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Giảng viên</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Hài lòng</div>
            </div>
          </div>
        </section>

        <section className="about-section contact-section">
          <h2>Liên hệ với chúng tôi</h2>
          <p>
            Có câu hỏi hoặc đề xuất? Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <strong>Email:</strong> contact@edtech.vn
            </div>
            <div className="contact-item">
              <strong>Hotline:</strong> 1900 xxxx
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
