export enum ResultStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ABANDONED = "ABANDONED",
}

export const ResultStatusLabel: Record<ResultStatus, string> = {
  [ResultStatus.IN_PROGRESS]: "Đang làm",
  [ResultStatus.COMPLETED]: "Hoàn thành",
  [ResultStatus.ABANDONED]: "Bỏ dở",
};
