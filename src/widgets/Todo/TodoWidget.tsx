import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { loadTodos } from "../../util/queries";
import { supabase } from "../../util/supabase";

const TodoWidget: WidgetComponent = (props) => {
  const loadTheseTodos = async () => loadTodos(props.widget.id);
  const [loadedTodos, { refetch }] = createResource(loadTheseTodos);
  const [storedTodos, setStoredTodos] = createStore<Todo[]>([]);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = loadedTodos();
    if (returnedValue) setStoredTodos(returnedValue);
  });

  // TODO This function might feel slow for users.
  // TODO replace 2 with actual widget ids
  async function createNewTask(e: Event) {
    e.preventDefault();
    const { data, error } = await supabase
      .from("todos")
      .insert({
        task: inputTodo(),
        is_complete: false,
        widget_id: props.widget.id,
      })
      .select();
    if (data) {
      setStoredTodos((prev) => [...prev, ...data]);
      setInputTodo("");
      return;
    }
    if (error) {
      console.error(error.message);
    }
    setInputTodo("");
    refetch();
  }

  async function deleteTask(e: Event, item: Todo) {
    e.preventDefault();
    const { error } = await supabase.from("todos").delete().eq("id", item.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    setStoredTodos((prev) => prev.filter((i) => i.id !== item.id));
  }

  // TODO make update task work.
  async function updateTask(e: Event, item: Todo) {
    e.preventDefault();
    console.log("Task updated");
    // const { error } = await supabase.from("todos").delete().eq("id", item.id);
    // if (error) {
    //   console.error(error.message);
    //   refetch();
    //   return;
    // }
    // setStoredTodos((prev) => prev.filter((i) => i.id !== item.id));
  }

  async function deleteTodoList(e: Event, item: Widget) {
    e.preventDefault();
    const { error } = await supabase.from("todos").delete().eq("id", item.id);
    if (error) {
      console.error(error.message);
      return;
    }
    // setStoredWidgets((prev) => prev.filter((i) => i.id !== item.id));
  }

  const [inputTodo, setInputTodo] = createSignal("");

  return (
    <ErrorBoundary
      fallback={
        <div>
          <p>Something went terribly wrong. Try refreshing the page!</p>
          <p>{loadedTodos.error}</p>
        </div>
      }
    >
      <Switch>
        <Match when={loadedTodos.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!loadedTodos.loading}>
          <h2></h2>
          <div class="m-2 flex flex-col space-y-2">
            <For each={storedTodos}>
              {(item, idx) => {
                return (
                  <form
                    onSubmit={(e) => updateTask(e, item)}
                    class="flex space-x-2"
                  >
                    <input value={item.task || ""} class="bg-transparent" />
                    <button type="button" onClick={(e) => deleteTask(e, item)}>
                      &#10006;
                    </button>
                  </form>
                );
              }}
            </For>
          </div>
        </Match>
      </Switch>
      <form onSubmit={createNewTask}>
        <input
          class="border"
          type="text"
          name="todo"
          required
          value={inputTodo()}
          onInput={(e) => setInputTodo(e.currentTarget.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </ErrorBoundary>
  );
};

export default TodoWidget;
