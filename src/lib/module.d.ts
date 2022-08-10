import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";

export {};

declare global {
  type Status = {
    name: string;
    text: string;
    tags: string[];
    location: { lat: number; lng: number };
  };

  type CalendarDay = {
    date: Dayjs;
    holiday?: TimedEvent;
  };
}
