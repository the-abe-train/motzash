import { Component, Setter } from "solid-js";

type Props = {
  widget: WidgetData | null;
  setActiveWidget: Setter<WidgetData | null>;
};

const WidgetPreview: Component<Props> = ({ widget, setActiveWidget }) => {
  if (!widget) return <></>;
  return (
    <div class="bg-blue-100 h-full" onClick={() => setActiveWidget(widget)}>
      {widget.name} preview
    </div>
  );
};

export default WidgetPreview;
