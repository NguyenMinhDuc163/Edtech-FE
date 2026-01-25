const CATEGORY_STYLES: Record<
  string,
  { icon: string; color: string; bg: string }
> = {
  PROGRAMMING_FOUNDATION: { icon: "💻", color: "#3B82F6", bg: "#EFF6FF" },
  WEB_DEVELOPMENT: { icon: "🌐", color: "#F59E0B", bg: "#FFFBEB" },
  MOBILE_DEVELOPMENT: { icon: "📱", color: "#10B981", bg: "#ECFDF5" },
  BACKEND_DEVELOPMENT: { icon: "⚙️", color: "#6366F1", bg: "#EEF2FF" },
  FRONTEND_DEVELOPMENT: { icon: "🎨", color: "#EC4899", bg: "#FDF2F8" },
  DATA_SCIENCE: { icon: "📊", color: "#8B5CF6", bg: "#F5F3FF" },
  AI_MACHINE_LEARNING: { icon: "🤖", color: "#EF4444", bg: "#FEF2F2" },
  DEVOPS_CLOUD: { icon: "☁️", color: "#06B6D4", bg: "#ECFEFF" },
  DATABASE: { icon: "🗄️", color: "#14B8A6", bg: "#F0FDFA" },
  SOFTWARE_TESTING: { icon: "🐞", color: "#84CC16", bg: "#F7FEE7" },
  CYBER_SECURITY: { icon: "🛡️", color: "#374151", bg: "#F3F4F6" },
  CAREER_SOFT_SKILLS: { icon: "🤝", color: "#F97316", bg: "#FFF7ED" },
  DEFAULT: { icon: "📚", color: "#64748B", bg: "#F8FAFC" },
};

export const getStyleByCategory = (category: string) => {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.DEFAULT;
};
