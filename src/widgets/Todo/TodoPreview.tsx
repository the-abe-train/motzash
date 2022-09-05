import { createSignal, For, Show, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import { supabase } from "../../util/supabase";

const TodoList: WidgetListComponent = (props) => {
  // const [widgets] = splitProps(props)
  const [storedWidgets, setStoredWidgets] = createStore(props.widgets);
  const [inputName, setInputName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [msg, setMsg] = createSignal("");

  console.log("Todo list");

  async function createNewWidget(e: Event) {
    e.preventDefault();
    setLoading(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: inputName(),
        user_id,
        type: "todo",
      })
      .select();
    if (data) {
      setStoredWidgets((prev) => (prev ? [...prev, ...data] : data));
      setInputName("");
      setLoading(false);
      setMsg("");
      return;
    }
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
    }
    setLoading(false);
    setInputName("");
  }

  async function deleteWidget(e: Event, item: Widget) {
    e.preventDefault();
    const { error } = await supabase.from("todos").delete().eq("id", item.id);
    if (error) {
      console.error(error.message);
      return;
    }
    setStoredWidgets((prev) => prev.filter((i) => i.id !== item.id));
  }

  return (
    <div>
      <ul class="list-disc list-inside mx-2">
        <For each={storedWidgets}>
          {(widget) => {
            return (
              <form class="flex space-x-2">
                <li
                  class="cursor-pointer"
                  onClick={() => props.setActiveWidget(widget)}
                >
                  {widget.name}
                </li>
                <button type="button" onClick={(e) => deleteWidget(e, widget)}>
                  &#10006;
                </button>
              </form>
            );
          }}
        </For>
      </ul>
      <Show when={props.isActive}>
        <form
          onSubmit={createNewWidget}
          class="m-4 p-4 flex flex-col space-y-4"
        >
          <input
            type="text"
            value={inputName()}
            onChange={(e) => setInputName(e.currentTarget.value)}
            class="w-fit p-2"
          />
          <button
            class="w-fit p-2 border border-black rounded
       bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
            disabled={loading()}
          >
            Create new todo list
          </button>
        </form>
        <p>{msg()}</p>
      </Show>
    </div>
  );
};

export default TodoList;
