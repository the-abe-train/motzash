import { User } from "@supabase/supabase-js";
import {
  children,
  createSignal,
  onMount,
  ParentComponent,
  Setter,
  Show,
} from "solid-js";
import Auth from "../pages/Auth";
import { supabase } from "../util/supabase";

type Props = {
  setActiveMacro: Setter<WidgetMacro | null>;
  setActiveWidget: Setter<Widget | null>;
  activeMacro: WidgetMacro | null;
  activeWidget: Widget | null;
};

const Widget: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  // Putting this weird default "true" value in the signal to stop the Auth
  // screen from flashing for logged-in users.
  const [user, setUser] = createSignal<User | null | boolean>(true);
  onMount(async () => {
    const supabaseUser = await supabase.auth.getUser();
    setUser(supabaseUser.data.user);
  });
  return (
    <div class="bg-blue-100 h-full relative p-2">
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
      <Show when={user()} fallback={<Auth />}>
        {c()}
      </Show>
    </div>
  );
};

export default Widget;
