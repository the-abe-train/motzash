import dayjs from "dayjs";

export function findNextEvent(
  weeks: CalendarDay[][],
  type: string,
  prev = dayjs()
) {
  const x = weeks.flatMap((day) => day);
  const withType = x.filter((day) =>
    day.holidays?.some((h) => h.desc === type)
  );
  const nextEvent = withType.find((event) => {
    const date = event.date;
    return date.isAfter(prev);
  });
  // console.log(nextEvent);
  if (nextEvent) {
    if (nextEvent.holidays) {
      if (nextEvent.holidays.length > 0) {
        return {
          day: dayjs(nextEvent.holidays[0].eventTime),
          event: nextEvent.holidays[0].linkedEvent?.desc || "Shabbat",
        };
      }
    }
  }
}
