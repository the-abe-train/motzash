import { For, Show } from "solid-js";
import Checkbox from "../../assets/icons/Checkbox.svg";

const TodoPreview: WidgetPreviewComponent = (props) => {
  // In the design, this one has the number of items left to do for each list,
  // but that would require loading them in ahead of time, which I don't wanna
  // do.

  const fallback = () => {
    return (
      <div
        class="bg-ghost p-2 w-full flex space-x-2
  border border-black rounded"
      >
        <img src={Checkbox} alt="Checkbox" />
        <p>Create new Todo list</p>
      </div>
    );
  };

  return (
    <div
      class="space-y-4 min-h-[100px] md:min-h-[160px]"
      data-cy="todo-preview"
    >
      <For each={props.widgets.slice(0, 3)}>
        {(widget) => {
          return (
            <div
              class="bg-ghost p-2 w-full flex space-x-2
            border border-black rounded"
            >
              <img src={Checkbox} alt="Checkbox" height={24} />
              <p class="flex-grow overflow-ellipsis overflow-hidden">
                {widget.name}
              </p>
            </div>
          );
        }}
      </For>
      <Show when={props.widgets.length < 3}>{fallback()}</Show>
    </div>
  );
};

export default TodoPreview;
