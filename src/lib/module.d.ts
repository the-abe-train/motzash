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

  // API
  type Geoname = {
    adminCode1: string;
    adminCodes1: { ISO3166_2: string }; // Not sure if this one is always true
    adminName1: string;
    countryCode: string;
    countryId: string;
    countryName: string;
    distance: string;
    fcl: string;
    fclName: string;
    fcode: string;
    fcodeName: string;
    geonameId: number;
    lat: string;
    lng: string;
    name: string;
    population: number;
    toponymName: string;
  };

  type Geodata = {
    geonames: Geoname[];
  };

  type Timezone = {
    countryCode: string;
    countryName: string;
    dstOffset: number;
    gmtOffset: number;
    lat: number;
    lng: number;
    rawOffset: number;
    sunrise: string;
    sunset: string;
    time: string;
    timezoneId: string;
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
