import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { HebrewCalendar, CalOptions, TimedEvent, Location } from "@hebcal/core";

import Calendar from "../components/Calendar";
import WidgetPreview from "../components/WidgetPreview";
import Widget from "../components/Widget";
import Todo from "../components/widgets/Todo";

import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import { findNextEvent } from "../util/datetime";
import { getHebcalLocation } from "../util/location";
import Cookbook from "../components/widgets/Cookbook";
import { loadWidgets } from "../util/queries";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

const Dashboard: Component = () => {
  const [cal, setCal] = createSignal<TimedEvent[]>([]);
  const [location, setLocation] = createSignal<Location | null>(null);
  const [widgets, { refetch: refetchWidgets }] = createResource(loadWidgets);

  onMount(async () => {
    const newLocation = await getHebcalLocation();
    setLocation(newLocation);

    const calOptions: CalOptions = {
      isHebrewYear: false,
      numYears: 1,
      candlelighting: true,
    };

    if (newLocation) calOptions["location"] = newLocation;

    setCal(HebrewCalendar.calendar(calOptions) as TimedEvent[]);
  });

  // TODO check if this flag accounts for chag, or if I need a separate one
  const nextCandleLighting = () => findNextEvent(cal(), "Candle lighting");
  const nextHavdalah = () => findNextEvent(cal(), "Havdalah");

  // Widget grid
  const [activeMacro, setActiveMacro] = createSignal<WidgetMacro | null>(null);

  // TODO replace this with widget data from database
  // const widgetMacros: WidgetMacro[] = [
  //   { name: "Cookbook", type: "cookbook", component: Cookbook, widgets: [] },
  //   {
  //     name: "Todos",
  //     type: "todo",
  //     component: () => Todo({ widgetId: 2 }),
  //     widgets: [],
  //   },
  //   {
  //     name: "Polls",
  //     type: "poll",
  //     component: () => Todo({ widgetId: 2 }),
  //     widgets: [],
  //   },
  // ];

  // TODO when previews are more thoroughly designed, the data should be passed
  // through to create a customized preview by widget type, rather than
  // rendering a list from here.

  // All widgets categorized by type
  const widgetsReduced = () => {
    const staticWidgets = widgets();
    if (staticWidgets) {
      const widgetMacros = [
        {
          name: "Cookbook",
          type: "cookbook",
          component: Cookbook,
          widgets: [] as Widget[],
        },
        {
          name: "Todos",
          type: "todo",
          component: Todo,
          widgets: [] as Widget[],
        },
        {
          name: "Polls",
          type: "poll",
          component: Todo,
          widgets: [] as Widget[],
        },
      ];
      const widgetCategories = staticWidgets.map((w) => w.type);
      const starter = widgetCategories?.reduce((obj, type) => {
        if (type) {
          obj[type] = [];
        }
        return obj;
      }, {} as Record<string, Widget[]>);
      const reducedObj = staticWidgets.reduce((obj, w) => {
        if (w.type) {
          obj[w.type].push(w);
        }
        return obj;
      }, starter);
      return widgetMacros.map((w) => {
        w["widgets"] = reducedObj[w.type];
        return w;
      });
    }
  };

  createEffect(() => {
    console.log("Reduced", widgetsReduced());
  });

  // I need an array of objs to be rendered by For
  // The objs shoul have the following keys:
  // name, type, component (unrendered), array of widgets

  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside class="col-span-3 border-r flex flex-col space-y-5 p-2">
        <Show
          when={location()}
          fallback={
            <p>
              Please allow location permissions to view candle lighting times.
            </p>
          }
        >
          <h1 class="text-xl">Candle Lighting</h1>
          <p>
            Get ready! Shabbos starts {nextCandleLighting().date.calendar()}
          </p>
          <div class="flex justify-around">
            <div class="flex flex-col items-center">
              <span>Candle Lighting</span>
              <span>{nextCandleLighting().date.format("h:mm a")}</span>
            </div>
            <div class="flex flex-col items-center">
              <span>Motzash</span>
              <span>{nextHavdalah().date.format("h:mm a")}</span>
            </div>
          </div>
          <Calendar location={location()} />
        </Show>
      </aside>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={!activeMacro()}>
          <div class="bg-green-100 col-span-9 grid grid-cols-2 p-4 gap-4">
            <For each={widgetsReduced()}>
              {(macro) => {
                return (
                  <WidgetPreview
                    // @ts-ignore
                    widget={macro}
                    setActiveWidget={setActiveMacro}
                  >
                    <ul class="list-disc list-inside mx-2">
                      <For each={macro.widgets}>
                        {(widget) => {
                          return <li>{widget.name}</li>;
                        }}
                      </For>
                    </ul>
                  </WidgetPreview>
                );
              }}
            </For>
          </div>
        </Match>
        <Match when={activeMacro()}>
          {(activeWidget) => {
            return (
              <div class="bg-green-100 col-span-9 p-4">
                <Widget setActiveWidget={setActiveMacro}>
                  {activeWidget.component({ widgets: activeWidget.widgets })}
                </Widget>
              </div>
            );
          }}
        </Match>
      </Switch>
    </main>
  );
};

export default Dashboard;
