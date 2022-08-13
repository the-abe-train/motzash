import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component, VoidComponent } from "solid-js";

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

  type WidgetData = {
    name: string;
    component: Component;
  };
}
