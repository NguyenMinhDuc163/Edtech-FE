export const getMasteryInfo = (theta: number) => {
  if (theta < -1.0) {
    return { label: "Khởi động", color: "bg-gray-400", text: "text-gray-600" };
  }
  if (theta < 0) {
    return {
      label: "Đang phát triển",
      color: "bg-blue-500",
      text: "text-blue-600",
    };
  }
  if (theta < 1.5) {
    return {
      label: "Thành thạo",
      color: "bg-green-500",
      text: "text-green-600",
    };
  }
  return { label: "Xuất sắc", color: "bg-yellow-500", text: "text-yellow-600" };
};
