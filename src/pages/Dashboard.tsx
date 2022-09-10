import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  on,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { Link } from "@solidjs/router";
import { Location } from "@hebcal/core";

import { getHebcalLocation } from "../util/location";
import { loadMyStatus, loadWidgets } from "../util/queries";

import Calendar from "../components/Calendar";
import WidgetPreview from "../components/WidgetPreview";
import Widget from "../components/Widget";

import CookbookPreview from "../widgets/Cookbook/CookbookPreview";
import CookbookMacro from "../widgets/Cookbook/CookbookMacro";
import CookbookWidget from "../widgets/Cookbook/CookbookWidget";

import TodoPreview from "../widgets/Todo/TodoPreview";
import TodoMacro from "../widgets/Todo/TodoMacro";
import TodoWidget from "../widgets/Todo/TodoWidget";
import PollPreview from "../widgets/Poll/PollPreview";
import PollMacro from "../widgets/Poll/PollMacro";
import PollWidget from "../widgets/Poll/PollWidget";

const Dashboard: Component = () => {
  const [location, setLocation] = createSignal<Location | null>(null);
  const [widgets, { refetch }] = createResource(loadWidgets);
  const [myStatus] = createResource(loadMyStatus);
  const [activeMacro, setActiveMacro] = createSignal<WidgetMacro | null>(null);
  const [activeWidget, setActiveWidget] = createSignal<Widget | null>(null);

  onMount(async () => {
    const newLocation = await getHebcalLocation();
    setLocation(newLocation);
  });

  createEffect(
    on(activeMacro, () => {
      if (!activeMacro() && !activeWidget()) {
        refetch();
      }
    })
  );

  // All widgets categorized by type
  const widgetsReduced = () => {
    const widgetMacros = [
      {
        name: "Cookbook",
        type: "cookbook",
        colour: "#FFBC42",
        preview: CookbookPreview,
        macro: CookbookMacro,
        component: CookbookWidget,
        widgets: [],
      },
      {
        name: "Todos",
        type: "todo",
        colour: "#30C5FF",
        preview: TodoPreview,
        macro: TodoMacro,
        component: TodoWidget,
        widgets: [],
      },
      {
        name: "Polls",
        type: "poll",
        colour: "#FF6B7F",
        preview: PollPreview,
        macro: PollMacro,
        component: PollWidget,
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
    <main
      class="grid grid-cols-6 md:grid-cols-12 gap-6
    py-2 px-4 container mx-auto bg-yellow2"
    >
      <Calendar location={location()} />
      <Switch fallback={<div>Loading...</div>}>
        <Match when={!activeMacro()}>
          <Show when={widgetsReduced()} fallback={<p>Loading...</p>}>
            <For each={widgetsReduced()}>
              {(macro) => {
                return (
                  <WidgetPreview macro={macro} setActiveMacro={setActiveMacro}>
                    {macro.preview({
                      widgets: macro.widgets,
                      setActiveWidget,
                      isActive: false,
                    })}
                  </WidgetPreview>
                );
              }}
            </For>
            <div
              class="w-full flex flex-col items-center space-y-4 
            py-4 md:px-8 col-span-6 lg:col-span-4"
            >
              <h1 class="text-2xl font-header self-start">Status</h1>
              <div
                class="bg-ghost text-center border-2 border-black px-2 py-4
              flex flex-col space-y-4"
              >
                <p class="text-lg">"{myStatus()?.text}"</p>
                <p class="text-sm">{myStatus()?.city}</p>
              </div>
              <Link href="/friends">
                <button
                  class="p-2 border border-black rounded drop-shadow-small 
                  w-fit mx-auto
                   bg-ghost hover:drop-shadow-none transition-all"
                >
                  See Friend Map
                </button>
              </Link>
            </div>
          </Show>
        </Match>
        <Match when={activeMacro()} keyed>
          {(activeMacro) => {
            return (
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
            );
          }}
        </Match>
      </Switch>
    </main>
  );
};

export default Dashboard;
