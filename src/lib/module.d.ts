import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component, VoidComponent } from "solid-js";

export {};

declare global {
  type Status = {
    id?: string;
    user_id?: string;
    created_at?: string;
    text: string;
    tags: string[];
    lat: number | null;
    lng: number | null;
  };

  type Profile = {
    id: string;
    updated_at: string;
    username: string;
    handle: string;
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
