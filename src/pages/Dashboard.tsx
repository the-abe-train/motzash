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
import { Link } from "@solidjs/router";
import { Location } from "@hebcal/core";

import { getHebcalLocation } from "../util/location";
import { loadWidgets } from "../util/queries";

import Calendar from "../components/Calendar";
import WidgetPreview from "../components/WidgetPreview";
import Widget from "../components/Widget";

import CookbookPreview from "../widgets/Cookbook/CookbookPreview";
import CookbookMacro from "../widgets/Cookbook/CookbookMacro";
import CookbookWidget from "../widgets/Cookbook/CookbookWidget";

import TodoPreview from "../widgets/Todo/TodoPreview";
import TodoMacro from "../widgets/Todo/TodoMacro";
import TodoWidget from "../widgets/Todo/TodoWidget";

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
        preview: CookbookPreview,
        macro: CookbookMacro,
        component: CookbookWidget,
        widgets: [],
      },
      {
        name: "Todos",
        type: "todo",
        preview: TodoPreview,
        macro: TodoMacro,
        component: TodoWidget,
        widgets: [],
      },
      {
        name: "Polls",
        type: "poll",
        preview: TodoPreview,
        macro: TodoMacro,
        component: TodoWidget,
        widgets: [],
      },
    ] as WidgetMacro[];
    const widgetTypeMap = {
      meat_recipe: "cookbook",
      dairy_recipe: "cookbook",
      pareve_recipe: "cookbook",
      todo: "todo",
      poll: "poll",
    } as Record<WidgetType, MacroType>;

    const staticWidgets = widgets();
    if (!staticWidgets) return widgetMacros;

    const categorizedWidgets = staticWidgets.reduce(
      (obj, widget) => {
        if (widget.type) {
          const macroType = widgetTypeMap[widget.type];
          obj[macroType].push(widget);
        }
        return obj;
      },
      { cookbook: [], todo: [], poll: [] } as Record<MacroType, Widget[]>
    );
    return widgetMacros.map((macro) => {
      macro["widgets"] = categorizedWidgets[macro.type];
      return macro;
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
                      {macro.preview({
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
              </div>
            </Show>
          </div>
        </Match>
        <Match when={activeMacro()} keyed>
          {(activeMacro) => {
            return (
              <div class="bg-green-100 col-span-9 p-4">
                <Widget
                  setActiveMacro={setActiveMacro}
                  setActiveWidget={setActiveWidget}
                  activeMacro={activeMacro}
                  activeWidget={activeWidget()}
                >
                  <Switch fallback={<div>Loading...</div>}>
                    <Match when={!activeWidget()}>
                      {activeMacro.macro({
                        widgets: activeMacro.widgets,
                        setActiveWidget,
                        isActive: true,
                      })}
                    </Match>
                    <Match when={activeWidget()} keyed>
                      {(activeWidget) =>
                        activeMacro.component({
                          widget: activeWidget,
                          setActiveWidget,
                        })
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
