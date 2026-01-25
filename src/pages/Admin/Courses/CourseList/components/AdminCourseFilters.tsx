import { CourseStatus, CourseVisibility } from "../libs/enum";

interface Props {
  value: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}

export default function CourseFilters({ value, onChange }: Props) {
  const handleChange = (key: string, val: string) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="admin-course-filters">
      <div className="filter-item">
        <label>Trạng thái:</label>
        <select
          value={value.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">Tất cả</option>
          {Object.values(CourseStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Hiển thị:</label>
        <select
          value={value.visibility || ""}
          onChange={(e) => handleChange("visibility", e.target.value)}
        >
          <option value="">Tất cả</option>
          {Object.values(CourseVisibility).map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item search-box">
        <label>Tìm kiếm:</label>
        <input
          type="text"
          placeholder="Nhập tên khóa học..."
          value={value.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      <button
        className="admin-btn admin-btn-secondary"
        onClick={() => onChange({ status: "", visibility: "", query: "" })}
      >
        Đặt lại
      </button>
    </div>
  );
}
