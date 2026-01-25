import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Pagination.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  showTotal?: boolean;
  showItemsPerPage?: boolean;
  onItemsPerPageChange?: (limit: number) => void;
  itemsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
  showTotal = true,
  showItemsPerPage = false,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50],
}) => {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className={`custom-pagination ${className}`}>
      <div className="pagination-info">
        {showTotal && totalItems !== undefined && (
          <span className="total-items">
            Tổng: <strong>{totalItems}</strong> bản ghi
          </span>
        )}

        {showItemsPerPage && itemsPerPage && onItemsPerPageChange && (
          <div className="items-per-page">
            <span>Hiển thị:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}/trang
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chỉ hiện nút prev/next khi có từ 2 trang trở lên */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="page-btn prev-btn"
            aria-label="Trang trước"
          >
            <FiChevronLeft />
          </button>

          <span className="page-info">
            Trang <strong>{currentPage}</strong> / {totalPages}
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="page-btn next-btn"
            aria-label="Trang sau"
          >
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;