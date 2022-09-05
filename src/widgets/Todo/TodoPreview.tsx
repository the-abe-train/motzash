import { For } from "solid-js";

const TodoPreview: WidgetPreviewComponent = (props) => {
  // In the design, this one has the number of items left to do for each list,
  // but that would require loading them in ahead of time, which I don't wanna
  // do.

  return (
    <div>
      <For each={props.widgets}>
        {(widget) => {
          return (
            <div class="bg-white p-2 w-full">
              <p>{widget.name}</p>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default TodoPreview;
