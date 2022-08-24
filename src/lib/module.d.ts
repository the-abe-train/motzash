import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component } from "solid-js";

export {};

declare global {
  type ScreenName = "UpdateStatus" | "AddFriend" | "Map" | null;

  type Coords = {
    lat: number;
    lng: number;
  };

  // Other types
  type CalendarDay = {
    date: Dayjs;
    holiday?: TimedEvent;
  };

  type WidgetData = {
    name: string;
    component: Component;
  };

  type ShowStatus = {
    name: string;
    text: string;
    tags: string[];
    lat?: number;
    lng?: number;
  };
}
