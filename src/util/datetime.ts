import { CalOptions, HebrewCalendar, Location, TimedEvent } from "@hebcal/core";
import dayjs from "dayjs";

export const generateCalendar = (location: Location) => {
  // TODO check if this flag accounts for chag, or if I need a separate one
  const calOptions: CalOptions = {
    isHebrewYear: false,
    candlelighting: true,
    numYears: 1,
    location,
  };
  const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];
  // console.log(cal);
  return cal;
};

export function findNextEvent(cal: TimedEvent[], type: string, prev = dayjs()) {
  const startDate = type === "Candle lighting" ? prev.subtract(1, "day") : prev;
  const nextEvent = cal.find((event) => {
    const date = dayjs(event.eventTime);
    const isRightEvent = event.desc === type;
    const isRightDate = date.isSame(startDate) || date.isAfter(startDate);
    return isRightDate && isRightEvent;
  });
  if (nextEvent) {
    // console.log("prev event", startDate.toDate());
    // console.log("next event", nextEvent.eventTime);
    return {
      day: dayjs(nextEvent.eventTime),
      event: nextEvent.linkedEvent?.desc || "Shabbat",
    };
  }
}

// TODO Get timestamp from havdalah Rata Die function
export function havdalahTimestamp(havdalah: number) {}
