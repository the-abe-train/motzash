import {
  Component,
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

type Props = {
  widgetId: number;
};

const Todo: Component<Props> = (props) => {
  const [loadedTodos, { refetch }] = createResource<Todo[] | null>(loadTodos);
  const [storedTodos, setStoredTodos] = createStore<Todo[]>([]);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = loadedTodos();
    if (returnedValue) setStoredTodos(returnedValue);
  });

  // TODO This function might feel slow for users.
  async function submitted() {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        task: inputTodo(),
        is_complete: false,
        widget_id: props.widgetId,
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

  const [inputTodo, setInputTodo] = createSignal("");

  return (
    <ErrorBoundary
      fallback={
        <div>
          <p>Something went terribly wrong</p>
          <p>{loadedTodos.error}</p>
        </div>
      }
    >
      <Switch>
        <Match when={loadedTodos.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!loadedTodos.loading}>
          <div>
            <For each={storedTodos}>{(item) => <div>{item.task}</div>}</For>
          </div>
        </Match>
      </Switch>
      <input
        class="border"
        type="text"
        name="todo"
        value={inputTodo()}
        onInput={(e) => setInputTodo(e.currentTarget.value)}
      />
      <button onClick={submitted}>Submit</button>
    </ErrorBoundary>
  );
};

export default Todo;
