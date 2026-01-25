import React from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";
import "../style/LeaderboardWidget.css";
import defaultAvatar from "@/assets/pictures/student.png";

export interface LeaderboardItem {
  rank: number;
  studentId: string;
  studentName: string;
  avatarUrl: string | null;
  averageScore: number;
  totalQuizzes: number;
  quizzesPassed: number;
  passRate: number;
}

interface LeaderboardWidgetProps {
  data: LeaderboardItem[];
  title?: string;
  currentStudentId?: string;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  data,
  title = "Bảng Xếp Hạng",
  currentStudentId,
}) => {
  const renderRank = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="lb-rank--top1" />;
      case 2:
        return <FaMedal className="lb-rank--top2" />;
      case 3:
        return <FaMedal className="lb-rank--top3" />;
      default:
        return <span className="lb-rank--normal">#{rank}</span>;
    }
  };

  return (
    <div className="lb-widget">
      <div className="lb-widget__header">
        <FaTrophy className="lb-widget__icon" />
        <h3 className="lb-widget__title">{title}</h3>
      </div>

      <div className="lb-widget__list">
        {data && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.studentId}
              className={`lb-item ${
                item.studentId === currentStudentId ? "lb-item--active" : ""
              }`}
            >
              <div className="lb-item__rank">{renderRank(item.rank)}</div>

              <img
                src={item.avatarUrl || `${defaultAvatar}${item.studentName}`}
                alt={item.studentName}
                className="lb-item__avatar"
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src = `${defaultAvatar}${item.studentName}`;
                }}
              />

              <div className="lb-item__info">
                <div className="lb-item__name" title={item.studentName}>
                  {item.studentName}
                </div>
                <div className="lb-item__sub">
                  {item.totalQuizzes} bài kiểm tra • {item.passRate}% đạt
                </div>
              </div>

              <div className="lb-item__score">
                {Math.round(item.averageScore)} điểm
              </div>
            </div>
          ))
        ) : (
          <div className="lb-widget__empty">
            <p>Chưa có dữ liệu xếp hạng.</p>
            <small>Hãy là người đầu tiên tham gia!</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardWidget;
