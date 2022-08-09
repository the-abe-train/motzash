import dayjs from "dayjs";

export function parseFutureDate(surveyClose: Date) {
  const MINUTES_PER_DAY = 1440;
  const MINUTES_PER_HOUR = 60;
  const totalMinutes = dayjs(surveyClose).diff(dayjs(), "minutes");
  if (totalMinutes < MINUTES_PER_DAY) {
    const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    const minutes = totalMinutes % MINUTES_PER_HOUR;
    return `${hours}h ${minutes}m`;
  }
  const days = Math.floor(totalMinutes / MINUTES_PER_DAY);
  const leftoverMinutes = totalMinutes % MINUTES_PER_DAY;
  const hours = Math.floor(leftoverMinutes / MINUTES_PER_HOUR);
  const minutes = leftoverMinutes % MINUTES_PER_HOUR;
  return `${days}d ${hours}h ${minutes}m`;
}
