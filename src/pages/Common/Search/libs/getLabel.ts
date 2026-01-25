export const COURSE_CATEGORIES = [
  { value: "PROGRAMMING_FOUNDATION", label: "Nhập môn lập trình" },
  { value: "WEB_DEVELOPMENT", label: "Phát triển Web" },
  { value: "MOBILE_DEVELOPMENT", label: "Lập trình Mobile" },
  { value: "BACKEND_DEVELOPMENT", label: "Backend" },
  { value: "FRONTEND_DEVELOPMENT", label: "Frontend" },
  { value: "DATA_SCIENCE", label: "Data Science" },
  { value: "AI_MACHINE_LEARNING", label: "AI & Machine Learning" },
  { value: "DEVOPS_CLOUD", label: "DevOps & Cloud" },
  { value: "DATABASE", label: "Cơ sở dữ liệu" },
  { value: "SOFTWARE_TESTING", label: "Kiểm thử phần mềm" },
  { value: "CYBER_SECURITY", label: "An ninh mạng" },
  { value: "CAREER_SOFT_SKILLS", label: "Kỹ năng nghề IT" },
];

export const getCategoryLabel = (value: string | null) => {
  if (!value) return "Danh mục";
  const cat = COURSE_CATEGORIES.find((c) => c.value === value);
  return cat ? cat.label : "Danh mục";
};
