import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../style/ChartsSection.css";
import AdminChartCard from "./AdminChartCard";
import { ADMIN_DOASHBOARD_COLORS } from "../libs/constants/color";
import type { ChartsSectionProps } from "../libs/interface/types";

const ChartsSection: React.FC<ChartsSectionProps> = ({
  stats,
  formatXAxis,
}) => {
  const {
    usersByPeriod = [],
    paidRegistrationsByPeriod = [],
    granularityUsed,
  } = stats;

  return (
    <div className="admin-charts-section">
      <h2 className="admin-section-heading">Biểu đồ Tăng trưởng</h2>

      <div className="admin-charts-grid">
        <AdminChartCard
          title="Người dùng mới"
          subtitle={`Thống kê theo ${granularityUsed}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={usersByPeriod}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={ADMIN_DOASHBOARD_COLORS.blueFill}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={ADMIN_DOASHBOARD_COLORS.blueFill}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={ADMIN_DOASHBOARD_COLORS.grid}
              />
              <XAxis
                dataKey="period"
                tickFormatter={formatXAxis}
                tick={{ fill: ADMIN_DOASHBOARD_COLORS.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                tick={{ fill: ADMIN_DOASHBOARD_COLORS.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelFormatter={formatXAxis}
                formatter={(value: number) => [value, "Người dùng"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={ADMIN_DOASHBOARD_COLORS.blueStroke}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AdminChartCard>

        <AdminChartCard
          title="Đăng ký Trả phí"
          subtitle={`Thống kê theo ${granularityUsed}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={paidRegistrationsByPeriod}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={ADMIN_DOASHBOARD_COLORS.greenFill}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={ADMIN_DOASHBOARD_COLORS.greenFill}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={ADMIN_DOASHBOARD_COLORS.grid}
              />
              <XAxis
                dataKey="period"
                tickFormatter={formatXAxis}
                tick={{ fill: ADMIN_DOASHBOARD_COLORS.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
              />
              <YAxis
                tick={{ fill: ADMIN_DOASHBOARD_COLORS.text, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                labelFormatter={formatXAxis}
                formatter={(value: number) => [value, "Đăng ký"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={ADMIN_DOASHBOARD_COLORS.greenStroke}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPaid)"
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </AdminChartCard>
      </div>
    </div>
  );
};

export default ChartsSection;
