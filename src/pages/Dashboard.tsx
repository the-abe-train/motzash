import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createResource,
  For,
  Match,
  on,
  Setter,
  Show,
  Switch,
  useContext,
} from "solid-js";
import { Link } from "@solidjs/router";

import { loadMyStatus, loadWidgets } from "../util/queries";

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
import Calendar from "../components/Calendar";
import { AuthContext } from "../context/auth2";

type Props = {
  activeMacro: Accessor<WidgetMacro | null>;
  setActiveMacro: Setter<WidgetMacro | null>;
  activeWidget: Accessor<Widget | null>;
  setActiveWidget: Setter<Widget | null>;
};

const Dashboard: Component<Props> = (props) => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const [widgets, { refetch }] = createResource(user_id, loadWidgets);
  const [myStatus] = createResource(user_id, loadMyStatus);

  createEffect(
    on(props.activeMacro, () => {
      if (!props.activeMacro() && !props.activeWidget()) {
        refetch();
      }
    })
  );

  // All widgets categorized by type
  const widgetsReduced = createMemo(() => {
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
        name: "To-do lists",
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
  });

  // Experimenting with the entire control flow from the dashboard page component
  // Using Match to show default, active macro, and active widget focuses
  // Child         -> Parent
  // WidgetPreview -> WidgetPreview
  // WidgetList    -> Widget
  // Widget        -> Widget

  return (
    <>
      <Calendar />
      <Switch fallback={<div>Loading...</div>}>
        <Match when={!props.activeMacro()}>
          <Show when={widgetsReduced()} fallback={<p>Loading...</p>}>
            <For each={widgetsReduced()}>
              {(macro) => {
                return (
                  <WidgetPreview
                    macro={macro}
                    setActiveMacro={props.setActiveMacro}
                  >
                    {macro.preview({
                      widgets: macro.widgets,
                      setActiveWidget: props.setActiveWidget,
                      isActive: false,
                    })}
                  </WidgetPreview>
                );
              }}
            </For>
            <div
              class="w-full flex flex-col items-center justify-center
               space-y-4 
            py-4 md:px-8 col-span-6 lg:col-span-4 "
            >
              <h1 class="text-2xl font-header self-start">Status</h1>
              <Link href="/friends" class="w-full flex-grow">
                <div
                  class="bg-ghost text-center border-2 border-black px-2 h-full
                  py-4 flex flex-col justify-center space-y-4 w-full min-h-[150px]"
                >
                  <Show
                    when={myStatus()}
                    fallback={<p>Click to add Status.</p>}
                    keyed
                  >
                    {(myStatus) => {
                      return (
                        <>
                          <p class="text-lg">"{myStatus.text}"</p>
                          <p class="text-sm">{myStatus.city}</p>
                        </>
                      );
                    }}
                  </Show>
                </div>
              </Link>
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
        <Match when={props.activeMacro()} keyed>
          {(activeMacro) => {
            return (
              <Widget
                setActiveMacro={props.setActiveMacro}
                setActiveWidget={props.setActiveWidget}
                activeMacro={activeMacro}
                activeWidget={props.activeWidget()}
              >
                <Switch fallback={<div>Loading...</div>}>
                  <Match when={!props.activeWidget()}>
                    {activeMacro.macro({
                      widgets: activeMacro.widgets,
                      setActiveWidget: props.setActiveWidget,
                      isActive: true,
                    })}
                  </Match>
                  <Match when={props.activeWidget()} keyed>
                    {(activeWidget) =>
                      activeMacro.component({
                        widget: activeWidget,
                        setActiveWidget: props.setActiveWidget,
                      })
                    }
                  </Match>
                </Switch>
              </Widget>
            );
          }}
        </Match>
      </Switch>
    </>
  );
};

export default Dashboard;
