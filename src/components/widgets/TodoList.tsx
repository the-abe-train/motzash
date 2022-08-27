import { For } from "solid-js";

const TodoList: WidgetListComponent = (props) => {
  return (
    <div>
      <ul class="list-disc list-inside mx-2">
        <For each={props.widgets}>
          {(widget) => {
            return (
              <li
                class="cursor-pointer"
                onClick={() => props.setActiveWidget(widget)}
              >
                {widget.name}
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};

export default TodoList;
