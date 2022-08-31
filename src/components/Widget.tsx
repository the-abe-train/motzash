import { User } from "@supabase/supabase-js";
import {
  children,
  createEffect,
  createSignal,
  onMount,
  ParentComponent,
  Setter,
  Show,
  useContext,
} from "solid-js";
import Auth from "../pages/Auth";
import { supabase } from "../util/supabase";

type Props = {
  setActiveMacro: Setter<WidgetMacro | null>;
  setActiveWidget: Setter<Widget | null>;
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
      <Show when={user()} fallback={<Auth />}>
        {c()}
      </Show>
    </div>
  );
};

export default Widget;
