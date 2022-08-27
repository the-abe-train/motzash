import { children, ParentComponent, Setter, Show, useContext } from "solid-js";
import Auth from "../pages/Auth";
import { supabase } from "../util/supabase";

type Props = {
  setActiveMacro: Setter<WidgetMacro | null>;
  setActiveWidget: Setter<Widget | null>;
};

// TODO move the Auth fallback to the dashboard?

const Widget: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  return (
    <div class="bg-blue-100 h-full relative">
      <button
        class="border rounded absolute top-2 right-2"
        onClick={() => {
          props.setActiveMacro(null);
          props.setActiveWidget(null);
        }}
      >
        X
      </button>
      <Show when={supabase.auth.getUser()} fallback={<Auth />}>
        {c()}
      </Show>
    </div>
  );
};

export default Widget;
