import {
  Component,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  onCleanup,
  onMount,
  Switch,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth";
import { Database } from "../lib/database.types";
import { createSync } from "../util/createSync";
import { supabase } from "../util/supabase";

type Todo = Database["public"]["Tables"]["todos"]["Insert"];

// const loadTodos = async () => {
//   const { data, error } = await supabase.from("todos").select();
//   if (error) {
//     console.log(error);
//     throw error;
//   }
//   return data;
// };

const Todo: Component = () => {
  const session = useContext(AuthContext);
  const [todos, setTodos] = createStore<Todo[]>([]);

  //   async function submitted() {
  //     const { data, error } = await supabase.from<Todo>("todos").insert({
  //       task: inputTodo(),
  //       is_complete: false,
  //       user_id: session()?.user?.id,
  //     });
  //     if (error) {
  //       console.error(error.message);
  //     }
  //     setInputTodo("");
  //   }

  const [inputTodo, setInputTodo] = createSignal("");

  return (
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
  );
};

export default Todo;
