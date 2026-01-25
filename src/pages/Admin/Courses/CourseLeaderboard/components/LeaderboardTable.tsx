import React from "react";

interface LeaderboardTableProps {
  leaderboard: any[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ leaderboard }) => {
  return (
    <div className="leaderboard-table-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Hạng</th>
            <th>Tên học viên</th>
            <th>Tổng điểm</th>
            <th>Điểm trung bình</th>
            <th>Số bài đã làm</th>
            <th>Tỷ lệ đạt</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? (
            <tr>
              <td colSpan={6} className="no-data">
                Không có dữ liệu bảng xếp hạng
              </td>
            </tr>
          ) : (
            leaderboard.map((item) => (
              <tr key={item.student_id}>
                <td className="rank-cell">#{item.rank}</td>
                <td>{item.username}</td>
                <td>{item.total_score}</td>
                <td>{item.avg_score}</td>
                <td>{item.completed_quizzes}</td>
                <td>{item.pass_rate ? `${item.pass_rate}%` : "—"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
