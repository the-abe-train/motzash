import { children, ParentComponent, Setter, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth";
import Auth from "../pages/Auth";

type Props = {
  setActiveMacro: Setter<WidgetMacro | null>;
  setActiveWidget: Setter<Widget | null>;
  activeMacro: WidgetMacro | null;
  activeWidget: Widget | null;
};

const Widget: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  const session = useContext(AuthContext);

  return (
    <div
      class="col-span-8 h-full relative p-2"
      style={{ "background-color": props.activeMacro?.colour }}
    >
      <div class="absolute top-2 right-2">
        <button
          class="border rounded bg-white mx-2 p-1"
          onClick={() => {
            props.setActiveMacro(null);
            props.setActiveWidget(null);
          }}
        >
          Dashboard
        </button>
        <Show when={props.activeWidget}>
          <button
            class="border rounded bg-white mx-2 p-1"
            onClick={() => {
              props.setActiveWidget(null);
            }}
          >
            {props.activeMacro?.name}
          </button>
        </Show>
      </div>
      <Show when={session()} fallback={<Auth />}>
        {c()}
      </Show>
    </div>
  );
};

export default Widget;
