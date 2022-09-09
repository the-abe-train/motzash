import { greg } from "@hebcal/core";
import dayjs from "dayjs";
import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  on,
  Show,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { HavdalahContext } from "../../context/havdalah";
import { loadTodos } from "../../util/queries";
import { supabase } from "../../util/supabase";

const TodoWidget: WidgetComponent = (props) => {
  const havdalah = useContext(HavdalahContext);
  const loadTheseTodos = async () => loadTodos(props.widget.id);
  const [loadedTodos, { refetch }] = createResource(loadTheseTodos);
  const [todos, setTodos] = createStore<Todo[]>([]);

  // Turn the async data into a store rather than a signal
  createEffect(
    on(loadedTodos, async () => {
      console.log("Running effect");
      const returnedValue = loadedTodos();
      if (returnedValue) {
        const updatedValues = returnedValue.map((todo) => {
          const expired = (todo.havdalah || 0) < greg.greg2abs(new Date());
          console.log("Expired?", expired);
          return { ...todo, is_complete: expired ? false : todo.is_complete };
        });
        console.log("Updated values", updatedValues);
        sortTodos({ newItems: updatedValues });
      }
    })
  );

  // Instruction sorting
  const sortTodos = (change?: {
    newItems?: Todo[];
    deleteItem?: Todo;
    changeItem?: Todo;
  }) => {
    console.log("Sorting todos");
    setTodos((prev) => {
      const newArray = change?.newItems
        ? [...prev, ...change?.newItems]
        : [...prev];
      if (change?.deleteItem) {
        const deleteIdx = newArray.findIndex(
          (todo) => todo.id === change.deleteItem?.id
        );
        newArray.splice(deleteIdx, 1);
      }
      if (change?.changeItem) {
        const changeIdx = newArray.findIndex(
          (todo) => todo.id === change.changeItem?.id
        );
        newArray.splice(changeIdx, 1, change.changeItem);
      }
      const sorted = newArray.sort((a, z) => {
        if (a.is_complete && !z.is_complete) {
          return 1;
        } else if (!a.is_complete && z.is_complete) {
          return -1;
        }
        return 1;
      });
      console.log(sorted);
      return sorted;
    });
  };

  async function createNewTask(e: Event) {
    e.preventDefault();
    const newTask = {
      task: inputTodo(),
      is_complete: false,
      widget_id: props.widget.id,
      havdalah,
    };
    sortTodos({ newItems: [newTask] });
    const { error } = await supabase.from("todos").insert(newTask).select();
    if (error) {
      console.error(error.message);
      refetch();
    }
    setInputTodo("");
  }

  async function deleteTask(e: Event, item: Todo) {
    e.preventDefault();
    sortTodos({ deleteItem: item });
    const { error } = await supabase.from("todos").delete().eq("id", item.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
  }

  async function changeName(e: Event, item: Todo) {
    e.preventDefault();
    console.log("item", item);
    const { error } = await supabase.from("todos").update(item);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
  }

  async function toggleComplete(e: Event, item: Todo, idx: number) {
    e.preventDefault();
    const newTodo = {
      ...item,
      is_complete: !item.is_complete,
      havdalah,
    };
    sortTodos({ changeItem: newTodo });
    const { error } = await supabase.from("todos").update(newTodo);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
  }

  async function deleteTodoList(e: Event) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this recipe?")) {
      const { error } = await supabase
        .from("widgets")
        .delete()
        .eq("id", props.widget.id);
      if (error) {
        console.error(error.message);
        return;
      }
      props.setActiveWidget(null);
    }
  }

  const [inputTodo, setInputTodo] = createSignal("");

  console.log("Rata Die today", greg.greg2abs(dayjs().toDate()));

  return (
    <ErrorBoundary
      fallback={
        <div>
          <p>Something went terribly wrong. Try refreshing the page!</p>
          <p>{loadedTodos.error}</p>
        </div>
      }
    >
      <h2 class="text-xl">{props.widget.name}</h2>
      <Show when={loadedTodos.state === "ready"} fallback={<p>Loading...</p>}>
        <div class="m-2 flex flex-col space-y-2">
          <For each={todos}>
            {(item, idx) => {
              return (
                <form
                  onSubmit={(e) => changeName(e, item)}
                  class="flex space-x-2"
                >
                  <input
                    value={item.task || ""}
                    class="bg-transparent"
                    style={{
                      "text-decoration-line": item.is_complete
                        ? "line-through"
                        : "inherit",
                    }}
                    onChange={(e) =>
                      setTodos(idx(), "task", e.currentTarget.value)
                    }
                  />
                  <button type="button" onClick={(e) => deleteTask(e, item)}>
                    &#10006;
                  </button>
                  <button
                    type="button"
                    onClick={(e) => toggleComplete(e, item, idx())}
                  >
                    &#10004;
                  </button>
                </form>
              );
            }}
          </For>
        </div>
      </Show>
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
      <button class="bg-white p-1 my-20" onClick={deleteTodoList}>
        Delete todo list
      </button>
    </ErrorBoundary>
  );
};

export default TodoWidget;
