/**
 * Định dạng thời gian ISO thành chuỗi "dd/mm/yyyy, hh:mm:ss" theo múi giờ Việt Nam.
 * @param iso - Chuỗi ISO datetime (ví dụ: 2025-10-28T13:45:00Z)
 * @returns Chuỗi ngày giờ định dạng tiếng Việt
 */
export const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "Không giới hạn";
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
