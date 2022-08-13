import { RealtimeSubscription } from "@supabase/supabase-js";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { supabase } from "../util/supabase";

type Todo = {
  id: number;
  task: string;
  inserted_at: string;
  is_complete: boolean;
};

const loadTodos = async () => {
  const { data, error } = await supabase.from<Todo>("todos").select();
  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

const Todo: Component = () => {
  const [data, { mutate, refetch }] = createResource(loadTodos);

  const [todos, setTodos] = createStore<Todo[]>([]);

  let subscription: RealtimeSubscription | null;

  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) setTodos(returnedValue);
  });

  onMount(() => {
    subscription = supabase
      .from<Todo>("todos")
      .on("*", (payload) => {
        switch (payload.eventType) {
          case "INSERT":
            setTodos((prev) => [...prev, payload.new]);
            break;
          case "UPDATE":
            setTodos((item) => item.id === payload.new.id, payload.new);
            break;
          case "DELETE":
            setTodos((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
            break;
        }
      })
      .subscribe();
  });

  onCleanup(() => {
    console.log("clean up");
    subscription?.unsubscribe();
  });

  const [inputTodo, setInputTodo] = createSignal("");

  async function submitted() {
    const { data, error } = await supabase.from<Todo>("todos").insert({
      task: inputTodo(),
      is_complete: false,
    });
    setInputTodo("");
  }

  return (
    <>
      <ErrorBoundary
        fallback={
          <div>
            <p>Something went terribly wrong</p>
            <p>{data.error}</p>
          </div>
        }
      >
        <Switch>
          <Match when={data.loading}>
            <p>Loading...</p>
          </Match>
          <Match when={!data.loading}>
            <div>
              <For each={todos}>{(item) => <div>{item.task}</div>}</For>
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
    </>
  );
};

export default Todo;
