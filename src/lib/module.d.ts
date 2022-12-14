import { TimedEvent } from "@hebcal/core";
import { Dayjs } from "dayjs";
import { Component, Setter } from "solid-js";
import { Database } from "./database.types";

export {};

declare global {
  // Enums
  type ScreenName = "UpdateStatus" | "AddFriend" | "Map" | null;
  type MacroType = "cookbook" | "todo" | "poll";
  type WidgetType =
    | "meat_recipe"
    | "dairy_recipe"
    | "pareve_recipe"
    | "todo"
    | "poll";

  type HolidayCategory =
    | "shabbat"
    | "yontif"
    | "chol"
    | "modern"
    | "fast"
    | "rosh_chodesh"
    | "minor"
    | "none";

  type Coords = {
    lat: number;
    lng: number;
  };

  type CalendarDay = {
    date: Dayjs;
    holidays?: TimedEvent[];
  };

  // Components
  type WidgetPreviewComponent = Component<{
    widgets: Widget[];
    setActiveWidget: Setter<Widget | null>;
    isActive: boolean;
  }>;

  type WidgetComponent = Component<{
    widget: Widget | UserWidget;
    setActiveWidget: Setter<Widget | null>;
  }>;

  type WidgetMacro = {
    name: string;
    type: MacroType;
    colour: string;
    preview: WidgetPreviewComponent;
    macro: WidgetPreviewComponent;
    component: WidgetComponent;
    widgets: Widget[];
  };

  type ChartData = Record<string, number>;

  // type ChartData = {
  //   labels: string[];
  //   values: number[];
  // };

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

  type Friendships = Database["public"]["Tables"]["friendships"]["Row"];
  interface FriendRequest extends Friendships {
    requester: Database["public"]["Tables"]["profiles"]["Row"];
  }

  type Widget = Database["public"]["Tables"]["widgets"]["Row"];
  interface UserWidget extends Widget {
    profiles: {
      username: string;
    };
  }

  type Profile = Database["public"]["Tables"]["profiles"]["Update"];

  // Todo lists
  type Todo = Database["public"]["Tables"]["todos"]["Update"];
  interface TodoList extends Widget {
    todos: Todo[];
  }

  // Cookbook
  type RecipeMetadata = Database["public"]["Tables"]["recipe_metadata"]["Row"];
  type Ingredient = Database["public"]["Tables"]["recipe_ingredients"]["Row"];
  type Instruction = Database["public"]["Tables"]["recipe_instructions"]["Row"];
  interface Recipe extends Widget {
    recipe_metadata?: RecipeMetadata[];
    recipe_ingredients?: Ingredient[];
    recipe_instructions?: Instruction[];
  }

  // Polls
  type Vote = Database["public"]["Tables"]["poll_votes"]["Update"];
  interface Poll extends Widget {
    poll_votes: Vote[];
    profiles: Profile[];
  }
}
