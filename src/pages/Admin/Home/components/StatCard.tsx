import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass = "",
}) => (
  <div className={`admin-card ${colorClass}`}>
    <div className="flex items-center justify-between">
      <h4 className="card-title">{title}</h4>
      <Icon className="card-icon" />
    </div>
    <p className="card-value">{Number(value ?? 0).toLocaleString("vi-VN")}</p>
  </div>
);

export default StatCard;
