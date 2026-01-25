import React from "react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import type { DashboardQuery, TimeGranularity } from "../libs/interface/types";
import "../style/FilterBar.css";

interface FilterBarProps {
  filters: DashboardQuery;
  onFiltersChange: React.Dispatch<React.SetStateAction<DashboardQuery>>;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange }) => {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    onFiltersChange((prev) => {
      if (prev.to && newFrom > prev.to) {
        return { ...prev, from: newFrom, to: newFrom };
      }
      return { ...prev, from: newFrom };
    });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;
    onFiltersChange((prev) => {
      if (prev.from && newTo < prev.from) {
        return { ...prev, from: newTo, to: newTo };
      }
      return { ...prev, to: newTo };
    });
  };

  const handleGranularityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange((prev) => ({
      ...prev,
      granularity: e.target.value as TimeGranularity,
    }));
  };

  const applyPreset = (days: number | "THIS_MONTH") => {
    const today = new Date();
    let newFrom = "";
    let newTo = format(today, "yyyy-MM-dd");

    if (days === "THIS_MONTH") {
      newFrom = format(startOfMonth(today), "yyyy-MM-dd");
      newTo = format(endOfMonth(today), "yyyy-MM-dd");
    } else {
      newFrom = format(subDays(today, days), "yyyy-MM-dd");
    }

    let newGranularity: TimeGranularity = "day";
    if (typeof days === "number" && days > 60) newGranularity = "month";
    else if (typeof days === "number" && days > 14) newGranularity = "week";

    onFiltersChange({
      from: newFrom,
      to: newTo,
      granularity: newGranularity,
    });
  };

  return (
    <div className="filter-bar-container">
      <div
        className="filter-presets"
        style={{ marginBottom: "10px", display: "flex", gap: "8px" }}
      >
        <button className="btn-preset" onClick={() => applyPreset(7)}>
          7 ngày qua
        </button>
        <button className="btn-preset" onClick={() => applyPreset(30)}>
          30 ngày qua
        </button>
        <button className="btn-preset" onClick={() => applyPreset(90)}>
          3 tháng qua
        </button>
        <button
          className="btn-preset"
          onClick={() => applyPreset("THIS_MONTH")}
        >
          Tháng này
        </button>
      </div>

      <div
        className="filter-inputs"
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label className="filter-label">
          Từ ngày:
          <input
            type="date"
            value={filters.from}
            onChange={handleFromChange}
            className="filter-input"
            max={filters.to}
          />
        </label>

        <label className="filter-label">
          Đến ngày:
          <input
            type="date"
            value={filters.to}
            onChange={handleToChange}
            className="filter-input"
            min={filters.from}
          />
        </label>

        <label className="filter-label">
          Nhóm theo:
          <select
            value={filters.granularity}
            onChange={handleGranularityChange}
            className="filter-input"
          >
            <option value="day">Theo Ngày</option>
            <option value="week">Theo Tuần</option>
            <option value="month">Theo Tháng</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
