import {
  createEffect,
  createResource,
  createSignal,
  For,
  useContext,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth2";
import { loadTodoLists } from "../../util/queries";
import { supabase } from "../../util/supabase";
import Checkbox from "../../assets/icons/Checkbox.svg";

const TodoMacro: WidgetPreviewComponent = (props) => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const [loadedLists, { refetch }] = createResource(user_id, loadTodoLists);
  const [lists, setLists] = createStore<TodoList[]>([]);
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

  const fallback = () =>
    loadedLists.state === "ready" ? <p>No lists yet.</p> : <p>Loading...</p>;

  async function createNewWidget(e: Event) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: inputName(),
        user_id,
        type: "todo",
      })
      .select();
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
    }
    if (data) {
      const newList = { ...data[0], todos: [] };
      setLists((prev) => (prev ? [...prev, newList] : newList));
    }
    setInputName("");
    setLoading(false);
    setMsg("");
  }

  return (
    <div class="mx-2 space-y-8 max-w-lg">
      <div class="space-y-4" data-cy="list-of-lists">
        <h2 class="font-header text-2xl">Lists</h2>
        <For each={lists} fallback={fallback}>
          {(todoList) => {
            const tasksLeft = todoList.todos.filter(
              (todo) => !todo.is_complete
            ).length;
            const suffix = tasksLeft !== 1 ? "s" : "";
            const word =
              (todoList.name?.length || 0) > 15 ? "" : ` task${suffix} left`;
            const tasksLeftString = `(${tasksLeft}${word})`;
            return (
              <div
                class="cursor-pointer bg-ghost flex space-x-2
              border border-black drop-shadow-small px-3 py-1
              hover:drop-shadow-none transition-all my-2 "
                onClick={() => props.setActiveWidget(todoList)}
              >
                <img src={Checkbox} class="inline" alt="checkbox" />
                <span class="flex-grow overflow-ellipsis overflow-hidden">
                  {todoList.name}
                </span>
                <span>{tasksLeftString}</span>
              </div>
            );
          }}
        </For>
      </div>
      <form onSubmit={createNewWidget} class="space-y-2">
        <h2 class="font-header text-2xl mb-1">Create new list</h2>
        <div class="flex max-w-md space-x-4">
          <input
            type="text"
            maxLength={50}
            value={inputName()}
            onChange={(e) => setInputName(e.currentTarget.value)}
            required
            class="px-2 py-1 flex-grow border border-black"
            data-cy="new-list-input"
          />
          <button
            class="w-fit py-1 px-2 border border-black rounded
        bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
            disabled={loading()}
          >
            Add list
          </button>
        </div>
      </form>
      <p>{msg()}</p>
    </div>
  );
};

export default TodoMacro;
