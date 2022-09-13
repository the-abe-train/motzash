import {
  createEffect,
  createResource,
  createSignal,
  For,
  useContext,
  on,
} from "solid-js";
import { createStore } from "solid-js/store";
import { useAuth } from "../../context/auth2";
import { loadTodoLists } from "../../util/queries";
import { supabase } from "../../util/supabase";
import Checkbox from "../../assets/icons/Checkbox.svg";

const TodoMacro: WidgetPreviewComponent = (props) => {
  const user_id = useAuth()?.user?.id;
  const [loadedLists, { refetch }] = createResource(loadTodoLists, {
    initialValue: [],
  });
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
    <div class="mx-2 space-y-8">
      <div class="space-y-4">
        <h2 class="font-header text-2xl">Lists</h2>
        <For
          each={lists}
          fallback={
            loadedLists.state === "ready" ? (
              <p>No lists yet.</p>
            ) : (
              <p>Loading...</p>
            )
          }
        >
          {(todoList) => {
            const tasksLeft = todoList.todos.filter(
              (todo) => !todo.is_complete
            ).length;
            const tasksLeftString = `(${tasksLeft} task${
              tasksLeft > 1 ? "s" : ""
            } left)`;
            return (
              <div
                class="cursor-pointer bg-ghost flex justify-between
                  border border-black drop-shadow-small px-3 py-1
                  hover:drop-shadow-none transition-all my-2"
                onClick={() => props.setActiveWidget(todoList)}
              >
                <div class="space-x-2">
                  <img src={Checkbox} class="inline" alt="checkbox" />
                  <span>{todoList.name}</span>
                </div>
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
            value={inputName()}
            onChange={(e) => setInputName(e.currentTarget.value)}
            required
            class="px-2 py-1 flex-grow border border-black"
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
