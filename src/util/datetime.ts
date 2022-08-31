import { TimedEvent } from "@hebcal/core";
import dayjs from "dayjs";

export function findNextEvent(cal: TimedEvent[], type: string, prev = dayjs()) {
  const nextEvent = cal.find((event) => {
    const date = dayjs(event.eventTime);
    const isRightEvent = event.desc === type;
    return date.isAfter(prev) && isRightEvent;
  });
  if (nextEvent) {
    return {
      day: dayjs(nextEvent.eventTime),
      event: nextEvent.linkedEvent?.desc || "Shabbat",
    };
  }
}
