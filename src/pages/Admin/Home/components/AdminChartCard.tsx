import React, { type ReactNode } from "react";

interface AdminChartCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
}

const AdminChartCard: React.FC<AdminChartCardProps> = ({
  title,
  children,
  subtitle,
}) => {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-header">
        <h3 className="admin-chart-title">{title}</h3>
        {subtitle && <span className="admin-chart-subtitle">{subtitle}</span>}
      </div>
      <div className="admin-chart-body">{children}</div>
    </div>
  );
};

export default AdminChartCard;
