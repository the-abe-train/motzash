import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component } from "solid-js";

export {};

declare global {
  // Database schemas
  type Status = {
    id?: string;
    created_at?: string;
    user_id: string;
    text: string;
    tags: string[];
    lat: number | null;
    lng: number | null;
    city: string;
  };

  type Profile = {
    id: string;
    updated_at: string;
    username: string;
    handle: string;
  };

  // type ProfileStatus = {
  //   id: string;
  //   updated_at: string;
  //   username: string;
  //   handle: string;
  //   created_at?: string;
  //   user_id: string;
  //   text: string;
  //   tags: string[];
  //   lat: number | null;
  //   lng: number | null;
  //   city: string;
  // };

  interface ProfileStatus extends Status {
    profiles: {
      username: string;
    };
  }

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
