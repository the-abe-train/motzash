import { children, ParentComponent, Setter } from "solid-js";

type Props = {
  macro: WidgetMacro;
  setActiveMacro: Setter<WidgetMacro | null>;
};

const WidgetPreview: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  return (
    <div class="h-full py-2 md:mx-6 lg:mx-4 col-span-6 lg:col-span-4 relative">
      <h1 class="text-2xl font-header mb-2">{props.macro.name}</h1>
      <div
        class="border-2 border-black p-6 cursor-pointer
        drop-shadow-small hover:drop-shadow-none transition-all "
        style={{ "background-color": props.macro.colour }}
        onClick={() => props.setActiveMacro(props.macro)}
      >
        {c()}
        <p class="mt-6 mb-1">See more...</p>
      </div>
    </div>
  );
};

export default WidgetPreview;
