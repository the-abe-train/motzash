import { children, ParentComponent, Setter } from "solid-js";

type Props = {
  widget: WidgetMacro;
  setActiveWidget: Setter<WidgetMacro | null>;
};

const WidgetPreview: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  if (!props.widget) return <></>;
  return (
    <div
      class="bg-blue-100 h-full cursor-pointer"
      onClick={() => props.setActiveWidget(props.widget)}
    >
      {props.widget.name}
      {c()}
    </div>
  );
};

export default WidgetPreview;
