import { HDate, TimedEvent } from "@hebcal/core";
import dayjs from "dayjs";
import invariant from "tiny-invariant";

export function findNextEvent(
  cal: TimedEvent[],
  type: string,
  prev = new HDate()
): CalendarDay {
  const nextEvent = cal.find((event) => {
    const eventHDate = event.getDate();
    return eventHDate.abs() >= prev.abs() && event.desc === type;
  });
  if (!nextEvent) return { date: dayjs(prev.getDate()) };
  console.log(nextEvent);
  return { date: dayjs(nextEvent.eventTime), holiday: nextEvent };
}
