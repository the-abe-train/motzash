import {
  Component,
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
import TodoList from "../components/widgets/TodoList";
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
  const [activeWidget, setActiveWidget] = createSignal<Widget | null>(null);

  // All widgets categorized by type
  const widgetsReduced = () => {
    const staticWidgets = widgets();
    if (staticWidgets) {
      const widgetMacros = [
        {
          name: "Cookbook",
          type: "cookbook",
          component: Cookbook,
          list: TodoList,
          widgets: [] as Widget[],
        },
        {
          name: "Todos",
          type: "todo",
          component: Todo,
          list: TodoList,
          widgets: [] as Widget[],
        },
        {
          name: "Polls",
          type: "poll",
          component: Todo,
          list: TodoList,
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

  // Experimenting with the entire control flow from the dashboard page component
  // Using Match to show default, active macro, and active widget focuses
  // Child         -> Parent
  // WidgetPreview -> WidgetPreview
  // WidgetList    -> Widget
  // Widget        -> Widget

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
                  <WidgetPreview macro={macro} setActiveMacro={setActiveMacro}>
                    {macro.list({
                      widgets: macro.widgets,
                      setActiveWidget,
                    })}
                  </WidgetPreview>
                );
              }}
            </For>
          </div>
        </Match>
        <Match when={activeMacro()}>
          {(activeMacro) => {
            return (
              <div class="bg-green-100 col-span-9 p-4">
                <Widget
                  setActiveMacro={setActiveMacro}
                  setActiveWidget={setActiveWidget}
                >
                  <Switch fallback={<div>Loading...</div>}>
                    <Match when={!activeWidget()}>
                      {activeMacro.list({
                        widgets: activeMacro.widgets,
                        setActiveWidget,
                      })}
                    </Match>
                    <Match when={activeWidget()}>
                      {(activeWidget) =>
                        activeMacro.component({ widget: activeWidget })
                      }
                    </Match>
                  </Switch>
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
