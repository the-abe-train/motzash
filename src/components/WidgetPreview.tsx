import { children, ParentComponent, Setter } from "solid-js";

type Props = {
  macro: WidgetMacro;
  setActiveMacro: Setter<WidgetMacro | null>;
  // setActiveWidget: Setter<Widget | null>;
};

// TODO requires some logic that displays a different amount of information
// depending on the size of the container because the container will be smaller
// when the preview is part of the grid vs when it takes up the screen.

const WidgetPreview: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  return (
    <div
      class="bg-blue-100 h-full cursor-pointer p-2"
      onClick={() => props.setActiveMacro(props.macro)}
    >
      <h2 class="text-lg">{props.macro.name}</h2>
      {c()}
    </div>
  );
};

export default WidgetPreview;
