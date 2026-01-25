import React from "react";
import { FaUserPlus, FaBookReader, FaDollarSign } from "react-icons/fa";
import SpotlightStatCard from "./SpotlightStatCard";
import "../style/KPISection.css";
import type { KPISectionProps } from "../libs/interface/types";

const KPISection: React.FC<KPISectionProps> = ({ data }) => {
  return (
    <div className="admin-kpi-section">
      <h2 className="admin-section-heading">Chỉ số Hiệu suất Chính (KPI)</h2>

      <div className="admin-kpi-grid">
        <SpotlightStatCard
          title="Tổng Doanh thu"
          value={Number(data.totalRevenue ?? 0).toLocaleString("vi-VN") + " đ"}
          icon={FaDollarSign}
          variant="orange"
          description={`${data.totalPaidOrders} đơn hàng thanh toán thành công.`}
        />

        <SpotlightStatCard
          title="Học viên mới"
          value={data.newStudents}
          icon={FaUserPlus}
          variant="blue"
          description="Số lượng học viên mới tham gia trong kỳ."
        />

        <SpotlightStatCard
          title="Hoạt động Đào tạo"
          value={data.activeCourses}
          icon={FaBookReader}
          variant="green"
          description={`${data?.totalExamAttempts ?? 0} lượt làm bài thi trên ${
            data?.activeCourses ?? 0
          } khóa học.`}
        />
      </div>
    </div>
  );
};

export default KPISection;
