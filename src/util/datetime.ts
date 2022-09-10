import { CalOptions, HebrewCalendar, Location, TimedEvent } from "@hebcal/core";
import dayjs from "dayjs";

export const generateCalendar = (location: Location | null) => {
  // TODO check if this flag accounts for chag, or if I need a separate one
  console.log("Generating calendar");
  const calOptions: CalOptions = {
    isHebrewYear: false,
    candlelighting: true,
    numYears: 1,
  };
  if (location) {
    calOptions["location"] = location;
    return HebrewCalendar.calendar(calOptions) as TimedEvent[];
  }
  return [];
};

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

// TODO Get timestamp from havdalah Rata Die function
export function havdalahTimestamp(havdalah: number) {}
