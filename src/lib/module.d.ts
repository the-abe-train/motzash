import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component } from "solid-js";
import { Database } from "./database.types";

export {};

declare global {
  type ScreenName = "UpdateStatus" | "AddFriend" | "Map" | null;

  type Coords = {
    lat: number;
    lng: number;
  };

  type CalendarDay = {
    date: Dayjs;
    holiday?: TimedEvent;
  };

  type WidgetData = {
    name: string;
    component: Component;
  };

  // Derived statuses
  type Status = Database["public"]["Tables"]["statuses"]["Update"];
  interface MyStatus extends Status {
    profiles: Database["public"]["Tables"]["profiles"]["Row"];
  }

  type Friend = { accepted: boolean; friend_id: string; requester_id: string };
  interface FriendStatus extends Status {
    profiles: {
      username: string;
      friend: Friend[];
      requester: Friend[];
    };
  }
}
