import { For } from "solid-js";
import Poll from "../../assets/Poll.svg";

const PollPreview: WidgetPreviewComponent = (props) => {
  const polls = props.widgets.filter((widget) => widget.type === "poll");
  return (
    <>
      <For each={props.widgets.slice(0, 3)}>
        {(widget) => {
          return (
            <div
              class="bg-white p-2 w-full flex space-x-2
        border border-black rounded"
            >
              <img src={Poll} alt="Poll" />
              <p>{widget.name}</p>
            </div>
          );
        }}
      </For>
    </>
  );
};

export default PollPreview;
