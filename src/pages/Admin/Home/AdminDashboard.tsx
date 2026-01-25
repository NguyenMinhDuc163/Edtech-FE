import { useState, useEffect } from "react";
import { format } from "date-fns";
import { adminCourseService } from "@/services/Course/adminCourseStatsService";
import FilterBar from "./components/FilterBar";
import KPISection from "./components/KPISection";
import ChartsSection from "./components/ChartsSection";
import type {
  DashboardQuery,
  DetailStats,
  ExamStats,
  OverviewStats,
} from "./libs/interface/types";
import { useToast } from "@/components/Notification/common/ToastProvider";
import ExamStatsSection from "./components/ExamStatsSection";
import { useLoadingStore } from "@/store/loadingStore";

export default function DashboardPage() {
  const { showToast } = useToast();

  const [overviewData, setOverviewData] = useState<OverviewStats | null>(null);
  const [detailData, setDetailData] = useState<DetailStats | null>(null);
  const [examData, setExamData] = useState<ExamStats | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const today = format(new Date(), "yyyy-MM-dd");
  const thirtyDaysAgo = format(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    "yyyy-MM-dd"
  );

  const [filters, setFilters] = useState<DashboardQuery>({
    from: thirtyDaysAgo,
    to: today,
    granularity: "day",
  });

  const userGrowthData = detailData?.charts?.userGrowth ?? [];
  const revenueData = detailData?.charts?.revenue ?? [];
  const hasChartData = userGrowthData.length > 0 || revenueData.length > 0;

  useEffect(() => {
    const fetchAllData = async () => {
      if (!overviewData) setLoading(true);

      adminCourseService
        .getOverview(filters)
        .then((data) => setOverviewData(data))
        .catch((err) => {
          console.error("Lỗi Overview:", err);
          showToast("Không thể tải số liệu tổng quan", "error");
        })
        .finally(() => {
          setLoading(false);
        });

      adminCourseService
        .getDetails(filters)
        .then((data) => setDetailData(data))
        .catch((err) => {
          console.error("Lỗi Details:", err);
        })
        .finally(() => setLoading(false));

      adminCourseService
        .getExamStats(filters)
        .then((data) => setExamData(data))
        .catch((err) => console.error("Lỗi Exam Stats:", err));
    };

    fetchAllData();
  }, [filters, showToast]);

  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return "";
    try {
      const date = new Date(tickItem);
      switch (filters.granularity) {
        case "month":
          return format(date, "MM/yyyy");
        case "week":
          return `W${format(date, "ww")}`;
        case "day":
        default:
          return format(date, "dd/MM");
      }
    } catch {
      return tickItem;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-header">Thống kê Tổng quan</h1>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      <div>{overviewData && <KPISection data={overviewData} />}</div>

      <div
        style={{ position: "relative", minHeight: "200px", marginTop: "20px" }}
      >
        {detailData && hasChartData ? (
          <ChartsSection
            stats={{
              usersByPeriod: userGrowthData,
              paidRegistrationsByPeriod: revenueData,
              granularityUsed: filters.granularity || "day",
            }}
            formatXAxis={formatXAxis}
          />
        ) : (
          !hasChartData && (
            <div className="admin-no-data">
              <p>Chưa có dữ liệu trong khoảng thời gian này.</p>
            </div>
          )
        )}
      </div>

      {examData && (
        <ExamStatsSection data={examData} formatXAxis={formatXAxis} />
      )}
    </div>
  );
}
