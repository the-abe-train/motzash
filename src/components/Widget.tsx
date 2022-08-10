import { Component, Setter } from "solid-js";

type Props = {
  widget: WidgetData | null;
  setActiveWidget: Setter<WidgetData | null>;
};

const WidgetPreview: Component<Props> = ({ widget, setActiveWidget }) => {
  if (!widget) return <></>;
  return (
    <div class="bg-blue-100 h-full relative">
      {widget.name}
      <button
        class="border rounded absolute top-2 right-2"
        onClick={() => setActiveWidget(null)}
      >
        X
      </button>
    </div>
  );
};

export default WidgetPreview;
