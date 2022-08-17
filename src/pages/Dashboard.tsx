import { Component, createSignal, For, Match, Switch } from "solid-js";
import { HebrewCalendar, Location, CalOptions, TimedEvent } from "@hebcal/core";
import Calendar from "../components/Calendar";

// import widgetData from "../data/widgets.json";

import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import { findNextEvent } from "../util/datetime";
import WidgetPreview from "../components/WidgetPreview";
import Widget from "../components/Widget";
import Todo from "../widgets/Todo";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

const Dashboard: Component = () => {
  const calOptions: CalOptions = {
    isHebrewYear: false,
    numYears: 1,
    candlelighting: true,
    location: Location.lookup("Toronto"),
  };
  const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];

  // TODO check if this flag accounts for chag, or if I need a separate one
  const nextCandleLighting = findNextEvent(cal, "Candle lighting");
  const nextHavdalah = findNextEvent(cal, "Havdalah");

  // Widget grid
  const [activeWidget, setActiveWidget] = createSignal<WidgetData | null>(null);

  const widgetData = [
    { name: "Cookbook", component: Todo },
    { name: "Todos", component: Todo },
    { name: "Polls", component: Todo },
  ];

  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside class="col-span-3 border-r flex flex-col space-y-5 p-2">
        <h1 class="text-xl">Candle Lighting</h1>
        <p>Get ready! Shabbos starts {nextCandleLighting.date.calendar()}</p>
        <div class="flex justify-around">
          <div class="flex flex-col items-center">
            <span>Candle Lighting</span>
            <span>{nextCandleLighting.date.format("h:mm a")}</span>
          </div>
          <div class="flex flex-col items-center">
            <span>Motzash</span>
            <span>{nextHavdalah.date.format("h:mm a")}</span>
          </div>
        </div>
        <Calendar />
      </aside>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={!activeWidget()}>
          <div class="bg-green-100 col-span-9 grid grid-cols-2 p-4 gap-4">
            <For each={widgetData}>
              {(widget) => {
                return (
                  <WidgetPreview
                    widget={widget}
                    setActiveWidget={setActiveWidget}
                  />
                );
              }}
            </For>
          </div>
        </Match>
        <Match when={activeWidget()}>
          <div class="bg-green-100 col-span-9 p-4">
            <Widget setActiveWidget={setActiveWidget}>
              {activeWidget()?.component({})}
            </Widget>
          </div>
        </Match>
      </Switch>
    </main>
  );
};

export default Dashboard;