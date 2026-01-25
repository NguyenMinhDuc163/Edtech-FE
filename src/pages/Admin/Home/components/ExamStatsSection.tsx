import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FaClock,
  FaCheckCircle,
  FaChartLine,
  FaClipboardList,
} from "react-icons/fa";
import AdminChartCard from "./AdminChartCard";
import "../style/ExamStats.css";
import type { ExamStatsSectionProps } from "../libs/interface/types";

const ExamStatsSection: React.FC<ExamStatsSectionProps> = ({
  data,
  formatXAxis,
}) => {
  const { summary, charts, insights } = data;

  return (
    <div className="exam-stats-section">
      <h2 className="admin-section-heading">Chất lượng Đào tạo & Thi cử</h2>

      <div className="exam-kpi-grid">
        <div className="exam-kpi-card blue">
          <div className="icon-box">
            <FaClipboardList />
          </div>
          <div>
            <span className="label">Tổng lượt thi</span>
            <strong className="value">{summary?.totalAttempts ?? 0}</strong>
          </div>
        </div>
        <div className="exam-kpi-card green">
          <div className="icon-box">
            <FaCheckCircle />
          </div>
          <div>
            <span className="label">Tỷ lệ đậu</span>
            <strong className="value">{summary?.passRate ?? 0}%</strong>
          </div>
        </div>
        <div className="exam-kpi-card purple">
          <div className="icon-box">
            <FaChartLine />
          </div>
          <div>
            <span className="label">Điểm trung bình</span>
            <strong className="value">{summary?.averageScore ?? 0}</strong>
          </div>
        </div>
        <div className="exam-kpi-card orange">
          <div className="icon-box">
            <FaClock />
          </div>
          <div>
            <span className="label">Thời gian làm bài TB</span>
            <strong className="value">
              {Math.round(summary?.avgTimeSpentMinutes ?? 0)} phút
            </strong>
          </div>
        </div>
      </div>

      <div className="exam-content-grid">
        <div className="exam-chart-area">
          <AdminChartCard title="Xu hướng Điểm số trung bình">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={charts?.scoreTrend ?? []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="period"
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6B7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  labelFormatter={formatXAxis}
                  formatter={(value) => [value, "Điểm TB"]}
                />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#8B5CF6",
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </AdminChartCard>
        </div>

        <div className="exam-insights-area">
          <div className="insight-card">
            <h3>Bài thi Khó</h3>
            <div className="table-responsive">
              <table className="insight-table">
                <thead>
                  <tr>
                    <th>Tên bài thi</th>
                    <th className="text-center">Lượt làm</th>
                    <th className="text-right">Tỷ lệ trượt</th>
                  </tr>
                </thead>
                <tbody>
                  {(insights?.hardestQuizzes ?? [])
                    .slice(0, 3)
                    .map((quiz, idx) => (
                      <tr key={idx}>
                        <td className="quiz-name" title={quiz.quizTitle}>
                          {quiz.quizTitle}
                        </td>
                        <td className="text-center">{quiz.attempts}</td>
                        <td className="text-right text-danger">
                          {quiz.failRate}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="insight-card">
            <h3>Học viên tích cực</h3>
            <div className="table-responsive">
              <table className="insight-table">
                <thead>
                  <tr>
                    <th>Email/Tên</th>
                    <th className="text-center">Lượt thi</th>
                    <th className="text-right">Điểm TB</th>
                  </tr>
                </thead>
                <tbody>
                  {(insights?.topActiveStudents ?? [])
                    .slice(0, 3)
                    .map((student, idx) => (
                      <tr key={idx}>
                        <td className="student-info">
                          <div
                            className="student-email"
                            title={student.studentEmail ?? ""}
                          >
                            {student.studentEmail
                              ? student.studentEmail.split("@")[0] + "..."
                              : "N/A"}
                          </div>
                        </td>
                        <td className="text-center">
                          {student.total_attempts ?? 0}
                        </td>
                        <td className="text-right font-bold">
                          {student.avgScore ?? 0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamStatsSection;
