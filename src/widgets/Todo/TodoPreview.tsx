import { For } from "solid-js";
import Checkbox from "../../assets/icons/Checkbox.svg";

const TodoPreview: WidgetPreviewComponent = (props) => {
  // In the design, this one has the number of items left to do for each list,
  // but that would require loading them in ahead of time, which I don't wanna
  // do.

  const fallback = (
    <div
      class="bg-white p-2 w-full flex space-x-2
border border-black rounded"
    >
      <img src={Checkbox} alt="Checkbox" />
      <p>Create new Todo list</p>
    </div>
  );

  return (
    <>
      <For each={props.widgets.slice(0, 3)} fallback={fallback}>
        {(widget) => {
          return (
            <div
              class="bg-white p-2 w-full flex space-x-2
            border border-black rounded"
            >
              <img src={Checkbox} alt="Checkbox" />
              <p>{widget.name}</p>
            </div>
          );
        }}
      </For>
    </>
  );
};

export default TodoPreview;
