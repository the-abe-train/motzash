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
import { Location } from "@hebcal/core";

import Calendar from "../components/Calendar";
import WidgetPreview from "../components/WidgetPreview";
import Widget from "../components/Widget";
import Todo from "../widgets/Todo";

import { getHebcalLocation } from "../util/location";
import Cookbook from "../widgets/Cookbook";
import { loadWidgets } from "../util/queries";
import TodoList from "../widgets/TodoList";
import { Link } from "@solidjs/router";

const Dashboard: Component = () => {
  const [location, setLocation] = createSignal<Location | null>(null);
  const [widgets] = createResource(loadWidgets);

  onMount(async () => {
    const newLocation = await getHebcalLocation();
    setLocation(newLocation);
  });

  // TODO check if this flag accounts for chag, or if I need a separate one

  // Widget grid
  const [activeMacro, setActiveMacro] = createSignal<WidgetMacro | null>(null);
  const [activeWidget, setActiveWidget] = createSignal<Widget | null>(null);

  // All widgets categorized by type
  const widgetsReduced = () => {
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
    const staticWidgets = widgets();
    if (!staticWidgets) return widgetMacros;

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
          <Calendar location={location()} />
        </Show>
      </aside>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={!activeMacro()}>
          <div class="bg-green-100 col-span-9 grid grid-cols-2 grid-rows-2 p-4 gap-4">
            <Show when={widgetsReduced()} fallback={<p>Loading...</p>}>
              <For each={widgetsReduced()}>
                {(macro) => {
                  return (
                    <WidgetPreview
                      macro={macro}
                      setActiveMacro={setActiveMacro}
                    >
                      {macro.list({
                        widgets: macro.widgets,
                        setActiveWidget,
                        isActive: false,
                      })}
                    </WidgetPreview>
                  );
                }}
              </For>
              <div class="w-full flex flex-col items-center justify-around py-4 px-8">
                <Link href="/friends" class="w-full">
                  <button
                    class="w-full p-8 rounded-xl
                bg-red-200 hover:bg-red-300 active:bg-red-400 disabled:bg-red-400"
                  >
                    See Friend Map
                  </button>
                </Link>
                <button
                  class="w-full p-8 rounded-xl border-dashed border-red-200 border-2
                hover:border-red-300 active:bborderg-red-400 disabled:border-red-400"
                >
                  Add widgets
                </button>
              </div>
            </Show>
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
                        isActive: true,
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
