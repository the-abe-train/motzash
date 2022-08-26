import { children, ParentComponent, Setter, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth";
import Auth from "../pages/Auth";
import { supabase } from "../util/supabase";

type Props = {
  setActiveWidget: Setter<WidgetMacro | null>;
};

const Widget: ParentComponent<Props> = (props) => {
  // const session = useContext(AuthContext);
  const c = children(() => props.children);
  return (
    <div class="bg-blue-100 h-full relative">
      <button
        class="border rounded absolute top-2 right-2"
        onClick={() => props.setActiveWidget(null)}
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
