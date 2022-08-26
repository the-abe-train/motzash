import { children, ParentComponent, Setter } from "solid-js";

type Props = {
  widget: WidgetMacro;
  setActiveWidget: Setter<WidgetMacro | null>;
};

const WidgetPreview: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  return (
    <div
      class="bg-blue-100 h-full cursor-pointer p-2"
      onClick={() => props.setActiveWidget(props.widget)}
    >
      <h2 class="text-lg">{props.widget.name}</h2>
      {c()}
    </div>
  );
};

export default WidgetPreview;
