import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
  useContext,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth";
import { loadTodoLists } from "../../util/queries";
import { supabase } from "../../util/supabase";

const TodoMacro: WidgetPreviewComponent = (props) => {
  const session = useContext(AuthContext);
  const [loadedLists, { refetch }] = createResource(loadTodoLists, {
    initialValue: [],
  });
  const [lists, setLists] = createStore(props.widgets);
  const [inputName, setInputName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [msg, setMsg] = createSignal("");

  createEffect(
    on(loadedLists, () => {
      if (loadedLists.state === "ready") {
        const returnedValue = loadedLists();
        if (returnedValue) setLists(returnedValue);
        setMsg("");
      }
    })
  );

  async function createNewWidget(e: Event) {
    e.preventDefault();
    setLoading(true);
    const user_id = session()?.user.id || "";

    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: inputName(),
        user_id,
        type: "todo",
      })
      .select();
    if (data) {
      setLists((prev) => (prev ? [...prev, ...data] : data));
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

  return (
    <div>
      <ul class="list-disc list-inside mx-2">
        <For each={lists}>
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

export default TodoMacro;
