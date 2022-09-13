import { children, ParentComponent, Setter, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth2";
import Auth from "../pages/Auth";

type Props = {
  setActiveMacro: Setter<WidgetMacro | null>;
  setActiveWidget: Setter<Widget | null>;
  activeMacro: WidgetMacro | null;
  activeWidget: Widget | null;
};

const Widget: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  const user = useContext(AuthContext);

  return (
    <div class="col-span-6 lg:col-span-8 h-full py-2">
      <h1 class="text-2xl font-header mb-2">{props.activeMacro?.name}</h1>
      <div
        class="relative p-4 pt-10 border-2 border-black"
        style={{ "background-color": props.activeMacro?.colour }}
      >
        <div class="absolute top-2 right-4 flex space-x-4">
          <button
            class="w-fit px-2 border border-black rounded
                  bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
            onClick={() => {
              props.setActiveMacro(null);
              props.setActiveWidget(null);
            }}
          >
            Dashboard
          </button>
          <Show when={props.activeWidget}>
            <button
              class="w-fit px-2 border border-black rounded
          bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
              onClick={() => {
                props.setActiveWidget(null);
              }}
            >
              {props.activeMacro?.name}
            </button>
          </Show>
        </div>
        <Show when={user()?.id} fallback={<Auth inWidget={true} />}>
          {c()}
        </Show>
      </div>
    </div>
  );
};

export default Widget;
