import type { IconType } from "react-icons";

export type TimeGranularity = "day" | "month" | "week";

export interface DashboardQuery {
  from: string;
  to: string;
  granularity: TimeGranularity;
}

export interface OverviewStats {
  totalRevenue: number;
  totalPaidOrders: number;
  newStudents: number;
  activeCourses: number;
  totalExamAttempts: number;
}

export interface ChartData {
  period: string;
  count?: number;
  value?: number;
  [key: string]: any;
}

export interface SpotlightStatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  description?: string;
  variant?: "blue" | "green" | "orange";
}

export interface ChartsSectionProps {
  stats: {
    usersByPeriod: ChartData[];
    paidRegistrationsByPeriod?: ChartData[];
    granularityUsed: string;
  };
  formatXAxis: (tickItem: string) => string;
}

export interface ExamStatsSectionProps {
  data: ExamStats;
  formatXAxis: (tick: string) => string;
}

export interface KPISectionProps {
  data: OverviewStats;
}

export interface DetailStats {
  charts: {
    revenue: any[];
    userGrowth: any[];
  };
  rankings: {
    topCourses: any[];
  };
}

export interface ExamStats {
  summary: {
    totalAttempts: number;
    averageScore: number;
    avgTimeSpentMinutes: number;
    passRate: number;
  };
  charts: {
    scoreTrend: any[];
  };
  insights: {
    hardestQuizzes: any[];
    topActiveStudents: any[];
  };
}
