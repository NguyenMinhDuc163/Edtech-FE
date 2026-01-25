export const isoDateUtil = {
  calculateDiff: (endTime: string, startTime: string): string => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "—";
      }

      const diffMs = end.getTime() - start.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      if (minutes <= 0) {
        return `${seconds} giây`;
      }

      return `${minutes} phút ${seconds} giây`;
    } catch {
      return "—";
    }
  },

  /**
   * @param isoDate ISO string
   * @returns "HH:mm:ss - DD/MM/YYYY"
   */
  formatDateTime: (isoDate: string): string => {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "—";

    const pad = (n: number) => (n < 10 ? `0${n}` : n);

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
  },
};
