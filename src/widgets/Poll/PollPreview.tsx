import { For } from "solid-js";
import Poll from "../../assets/icons/Poll.svg";

const PollPreview: WidgetPreviewComponent = (props) => {
  const fallback = (
    <div
      class="bg-ghost p-2 w-full flex space-x-2
border border-black rounded"
    >
      <img src={Poll} alt="Poll" />
      <p>Create new poll</p>
    </div>
  );
  return (
    <>
      <For each={props.widgets.slice(0, 3)} fallback={fallback}>
        {(widget) => {
          return (
            <div
              class="bg-ghost p-2 w-full flex space-x-2
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
