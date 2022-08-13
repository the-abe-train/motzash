import { children, ParentComponent, ParentProps, Setter } from "solid-js";

type Props = {
  setActiveWidget: Setter<WidgetData | null>;
};

const Widget: ParentComponent<Props> = (props) => {
  const c = children(() => props.children);
  return (
    <div class="bg-blue-100 h-full relative">
      <button
        class="border rounded absolute top-2 right-2"
        onClick={() => props.setActiveWidget(null)}
      >
        X
      </button>
      {c()}
    </div>
  );
};

export default Widget;
