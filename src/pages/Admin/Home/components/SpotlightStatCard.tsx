import React from "react";
import type { SpotlightStatCardProps } from "../libs/interface/types";

const SpotlightStatCard: React.FC<SpotlightStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  variant = "blue",
}) => {
  return (
    <div className={`kpi-card kpi-variant-${variant}`}>
      <div className="kpi-icon-wrapper">
        <Icon className="kpi-icon" />
      </div>
      <div className="kpi-content">
        <h3 className="kpi-label">{title}</h3>
        <div className="kpi-value">{value}</div>
        {description && <p className="kpi-desc">{description}</p>}
      </div>
    </div>
  );
};

export default SpotlightStatCard;
