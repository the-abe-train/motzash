import { CalOptions, HebrewCalendar, Location, TimedEvent } from "@hebcal/core";
import dayjs from "dayjs";
import { getHoliday } from "./holidays";

export const generateCalendar = (location: Location) => {
  const calOptions: CalOptions = {
    isHebrewYear: false,
    candlelighting: true,
    numYears: 1,
    location,
  };
  const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];
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
    return {
      day: dayjs(nextEvent.eventTime),
      event: nextEvent.linkedEvent?.desc || "Shabbat",
    };
  }
}

export function getEventDetails(cal: TimedEvent[], displayDay = dayjs()) {
  if (cal.length === 0) return null;
  const eventType = "Candle lighting";
  let startDate = displayDay.subtract(1, "day");
  let startEvent = cal.find((event) => {
    const eventDate = dayjs(event.eventTime);
    return eventDate.isSame(startDate, "date") && event.desc === eventType;
  });
  let i = 1;
  while (!startEvent) {
    startDate = startDate.add(1, "day");
    startEvent = cal.find((event) => {
      const eventDate = dayjs(event.eventTime);
      return eventDate.isSame(startDate, "date") && event.desc === eventType;
    });
    i++;
  }
  const endDate = dayjs(startEvent.eventTime).add(1, "day");
  const endEvent = cal.find((event) => {
    const eventDate = dayjs(event.eventTime);
    return eventDate.isSame(endDate, "date");
  });
  return {
    eventName: endEvent?.linkedEvent?.desc || "Shabbat",
    startDesc: startEvent.desc,
    startTime: dayjs(startEvent.eventTime),
    endDesc:
      endEvent?.desc === "Candle lighting"
        ? "Next candle lighting"
        : endEvent?.desc,
    endTime: dayjs(endEvent?.eventTime),
  };
}

export function currentEvent(weeks: CalendarDay[][], displayDay: dayjs.Dayjs) {
  const calendarDay = weeks
    .flatMap((day) => day)
    .find((day) => {
      return day.date.isSame(displayDay, "date");
    });
  if (calendarDay) {
    const holiday = getHoliday(calendarDay);
    return holiday.holiday?.desc;
  }
  return null;
}

// TODO Get timestamp from havdalah Rata Die function
// export function havdalahTimestamp(havdalah: number) {}
