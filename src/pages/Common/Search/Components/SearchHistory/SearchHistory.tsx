import React, { useEffect, useState, useRef } from "react";
import "./SearchHistory.css";
import { searchService } from "@/services/search/searchService";

interface SearchItem {
  search_id: string;
  keyword: string;
  created_at: string;
}

interface SearchHistoryProps {
  onSelect: (keyword: string) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<SearchItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    try {
      await searchService.deleteHistory(Number(id));
      setHistory((prev) => prev.filter((item) => item.search_id !== id));
    } catch (error) {
      console.error("❌ Failed to delete search history:", error);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await searchService.getHistory();
        setHistory(data || []);
      } catch (error) {
        console.error("❌ Failed to fetch search history:", error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="search-history-dropdown" ref={dropdownRef}>
      <div className="history-header">
        <span>Search History</span>
      </div>

      {history.length === 0 ? (
        <p className="no-history">No search history found</p>
      ) : (
        history.slice(0, 10).map((item) => (
          <div
            key={item.search_id}
            className="history-item"
            onMouseDown={() => onSelect(item.keyword)}
          >
            <div className="history-left">
              <i className="fa fa-clock history-icon" />
              <span>{item.keyword}</span>
            </div>

            <button
              className="delete-btn"
              tabIndex={-1}
              onMouseDown={(e) => handleDelete(e, item.search_id)}
              title="Delete this history"
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchHistory;
