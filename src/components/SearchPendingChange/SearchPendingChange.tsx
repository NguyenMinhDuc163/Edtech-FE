import { useState } from "react";
import type { PendingChange } from "@/types/Course/pendingchange"; 
import "./SearchPendingChange.css";

interface SearchPendingChangeProps {
  changes: PendingChange[];
  onFilter: (filtered: PendingChange[]) => void;
}

export default function SearchPendingChange({ changes, onFilter }: SearchPendingChangeProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    filterChanges(value, statusFilter);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterChanges(query, value);
  };

  const filterChanges = (searchText: string, status: string) => {
    let filtered = changes.filter(change =>
      change.courseTitle.toLowerCase().includes(searchText.toLowerCase())
    );

    if (status !== "ALL") {
      filtered = filtered.filter(change => change.status === status.toLowerCase());
    }

    onFilter(filtered);
  };

  return (
    <div className="search-pending-change-container">
      <input
        type="text"
        placeholder="Tìm kiếm khóa học..."
        value={query}
        onChange={handleQueryChange}
        className="search-pending-change-input"
      />
      <select
        value={statusFilter}
        onChange={handleStatusChange}
        className="search-pending-change-select"
      >
        <option value="ALL">Tất cả</option>
        <option value="draft">Bản nháp</option>
        <option value="pending">Đang chờ duyệt</option>
        <option value="approved">Đã duyệt</option>
        <option value="rejected">Bị từ chối</option>
      </select>
    </div>
  );
}
