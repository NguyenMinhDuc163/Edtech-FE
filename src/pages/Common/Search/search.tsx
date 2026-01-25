import React, { useState, useEffect, useRef } from "react";
import "./search.css";
import SearchDetail from "./Components/SearchDetail/searchdetail";
import SearchHistory from "./Components/SearchHistory/SearchHistory";
import { searchService } from "@/services/search/searchService";
import { courseService } from "@/services/Course/courseService";
import { useLoadingStore } from "@/store/loadingStore";
import { useSearchParams } from "react-router-dom";
import { COURSE_CATEGORIES, getCategoryLabel } from "./libs/getLabel";

interface Filters {
  category?: string;
  price_range?: "free" | "under_1m" | "1m_3m" | "3m_10m" | "above_10m";
  teacher?: string;
}

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [displayCourses, setDisplayCourses] = useState<any[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [suggestions, setSuggestions] = useState<{ keyword: string; highlighted: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(10);

  const [filters, setFilters] = useState<Filters>({});
  const [openDropdown, setOpenDropdown] = useState<"category" | "price" | "teacher" | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get("category");
  const priceOptions = [
    { label: "Miễn phí", value: "free" },
    { label: "Dưới 1 triệu", value: "under_1m" },
    { label: "1 - 3 triệu", value: "1m_3m" },
    { label: "3 - 10 triệu", value: "3m_10m" },
    { label: "Trên 10 triệu", value: "above_10m" },
  ];

  const handleCategoryChange = (catValue: string | null) => {
    const newParams = new URLSearchParams(searchParams);

    if (catValue) {
      newParams.set("category", catValue);
    } else {
      newParams.delete("category");
    }

    newParams.set("page", "1");

    setSearchParams(newParams);
    setOpenDropdown(null);
  };

  useEffect(() => {
    if (allCourses.length > 0) return;

    const loadAllCourses = async () => {
      setLoading(true);
      try {
        const courses = await courseService.getCoursesStudentRole();
        setAllCourses(courses);
      } catch (err) {
        setError("Không thể tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    loadAllCourses();
  }, []);

  const debounceTimer = useRef<number | null>(null);

  const fetchSuggestions = async (value: string) => {
    if (!value.trim() || value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const data = await searchService.getSuggestions(value.trim());
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Autocomplete error:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Debounce để không gọi API liên tục
  const debouncedFetch = (value: string) => {
    if (debounceTimer.current !== null) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const updateDisplayCourses = () => {
    if (allCourses.length === 0) {
      setDisplayCourses([]);
      return;
    }

    let filtered = [...allCourses];

    if (filters.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    if (filters.teacher) {
      filtered = filtered.filter(c =>
        c.teacher?.toLowerCase().includes(filters.teacher!.toLowerCase())
      );
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayCourses(filtered.slice(start, end));
  };

  useEffect(() => {
    updateDisplayCourses();
  }, [currentPage, pageSize, allCourses, filters]);

  const totalFilteredCourses = (() => {
    let filtered = [...allCourses];

    if (filters.category)
      filtered = filtered.filter(c => c.category === filters.category);

    if (filters.teacher) {
      const lower = filters.teacher.toLowerCase();
      filtered = filtered.filter(c => c.teacher?.toLowerCase().includes(lower));
    }

    return filtered.length;
  })();


  const totalPages = Math.ceil(totalFilteredCourses / pageSize);
  const startItem = totalFilteredCourses === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalFilteredCourses);

  // TÌM KIẾM
  const handleSearch = async () => {
    const searchTerm = query.trim();
    setCurrentPage(1);

    if (!searchTerm && Object.keys(filters).length === 0) {
      setLoading(true);
      try {
        const original = await courseService.getCoursesStudentRole();
        setAllCourses(original);
      } catch {
        setError("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const results = await searchService.searchCourses(searchTerm, {
        ...filters,
        top_k: 500,
      });
      setAllCourses(results || []);
    } catch {
      setError("Không tìm thấy kết quả");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (keyword: string) => {
    setQuery(keyword);
    setShowHistory(false);
  };

  const toggleFilter = (type: keyof Filters, value?: string) => {
    setFilters(prev => {
      if (!value || prev[type] === value) {
        const { [type]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [type]: value };
    });
    setOpenDropdown(null);
    setCurrentPage(1);
  };

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        (!suggestionsRef.current || !suggestionsRef.current.contains(target))
      ) {
        setShowHistory(false);
        setShowSuggestions(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const catFromUrl = searchParams.get("category");

    setFilters((prev) => {
      if (catFromUrl) {
        return { ...prev, category: catFromUrl };
      }
      else {
        const { category, ...rest } = prev;
        return rest;
      }
    });

    setCurrentPage(1);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="search-page">
      <div className="search-banner">
        <div className="search-bar-container" ref={searchContainerRef} style={{ position: "relative" }}>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm khóa học, giảng viên, kỹ năng..."
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);

              if (val.trim().length >= 2) {
                debouncedFetch(val);
                setShowHistory(false);
              } else {
                setSuggestions([]);
                setShowSuggestions(false);
                setShowHistory(true);
              }
            }}
            onFocus={() => {
              if (query.trim().length < 2) {
                setShowHistory(true);
                setShowSuggestions(false);
              } else if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowSuggestions(false);
                setShowHistory(false);
                handleSearch();
              }
            }}
          />
          <button className="search-btn" onClick={handleSearch}>
            Tìm kiếm
          </button>

          {/* DROPDOWN GỢI Ý AUTOCOMPLETE */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="autocomplete-dropdown" ref={suggestionsRef}>
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="autocomplete-item"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(item.keyword);
                    setShowSuggestions(false);
                    setShowHistory(false);
                    handleSearch();
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.highlighted }} />
                </div>
              ))}
            </div>
          )}

          {!showSuggestions && showHistory && <SearchHistory onSelect={handleSelectHistory} />}
        </div>

        <div className="filter-row" ref={dropdownRef}>
          {/* Danh mục */}
          <div className="filter-dropdown">
            <button
              className={`filter-btn ${currentCategory ? "active" : ""}`}
              onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
            >
              {getCategoryLabel(currentCategory)}
              <span className="dropdown-icon">▼</span>
            </button>

            {openDropdown === "category" && (
              <div className="search-dropdown-menu">
                <div
                  className={`search-dropdown-item ${!currentCategory ? "selected" : ""}`}
                  onClick={() => handleCategoryChange(null)}
                >
                  Tất cả
                </div>
                {COURSE_CATEGORIES.map(cat => (
                  <div
                    key={cat.value}
                    className={`search-dropdown-item ${currentCategory === cat.value ? "selected" : ""}`}
                    onClick={() => handleCategoryChange(cat.value)}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Giá */}
          <div className="filter-dropdown">
            <button
              className={`filter-btn ${filters.price_range ? "active" : ""}`}
              onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
            >
              {priceOptions.find(p => p.value === filters.price_range)?.label || "Giá tiền"} <span className="dropdown-icon">▼</span>
            </button>
            {openDropdown === "price" && (
              <div className="search-dropdown-menu">
                <div className="dropdown-item" onClick={() => toggleFilter("price_range")}>Tất cả</div>
                {priceOptions.map(opt => (
                  <div
                    key={opt.value}
                    className={`dropdown-item ${filters.price_range === opt.value ? "selected" : ""}`}
                    onClick={() => toggleFilter("price_range", opt.value)}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Giảng viên */}
          <div className="filter-dropdown">
            <input
              type="text"
              className="filter-input-teacher"
              placeholder="Nhập tên giảng viên..."
              value={filters.teacher || ""}
              onChange={(e) => toggleFilter("teacher", e.target.value || undefined)}
            />
          </div>
        </div>
      </div>

      {/* Kết quả + Phân trang */}
      <div className="search-results-container">
        {error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <SearchDetail courses={displayCourses} query={query} />

            {totalFilteredCourses > 0 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Hiển thị {startItem}–{endItem} trong {totalFilteredCourses} kết quả
                </div>

                <div className="pagination-controls">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value) as 10 | 20 | 50);
                      setCurrentPage(1);
                    }}
                    className="page-size-select"
                  >
                    <option value={10}>10 / trang</option>
                    <option value={20}>20 / trang</option>
                    <option value={50}>50 / trang</option>
                  </select>

                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="page-btn"
                  >
                    ← Trước
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`page-btn ${currentPage === pageNum ? "active" : ""}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && (
                    <>
                      <span className="page-dots">...</span>
                      <button onClick={() => handlePageChange(totalPages)} className="page-btn">
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="page-btn"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;