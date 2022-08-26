import { children, ParentComponent, Setter, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth";
import Auth from "../pages/Auth";

type Props = {
  setActiveWidget: Setter<WidgetData | null>;
};

const Widget: ParentComponent<Props> = (props) => {
  const session = useContext(AuthContext);
  const c = children(() => props.children);
  return (
    <div class="bg-blue-100 h-full relative">
      <button
        class="border rounded absolute top-2 right-2"
        onClick={() => props.setActiveWidget(null)}
      >
        X
      </button>
      <Show when={session()} fallback={<Auth />}>
        {c()}
      </Show>
    </div>
  );
};

export default Widget;
