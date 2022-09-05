import { createSignal, For, Show, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import { supabase } from "../util/supabase";

const TodoList: WidgetListComponent = (props) => {
  // const [widgets] = splitProps(props)
  const [storedWidgets, setStoredWidgets] = createStore(props.widgets);
  const [inputName, setInputName] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [msg, setMsg] = createSignal("");

  console.log("widgets", props.widgets);

  const cookbook = props.widgets.reduce(
    (book, widget) => {
      switch (widget.type) {
        case "dairy_recipe":
          book["dairy"]++;
          break;
        case "meat_recipe":
          book["meat"]++;
          break;
        case "pareve_recipe":
          book["pareve"]++;
          break;
      }
      return book;
    },
    { meat: 0, dairy: 0, pareve: 0 }
  );
  console.log(cookbook);

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
      <div class="bg-white p-2 w-full">
        <p>Meat ({cookbook["meat"]} recipes)</p>
      </div>
      <div class="bg-white p-2 w-full">
        <p>Dairy ({cookbook["dairy"]} recipes)</p>
      </div>
      <div class="bg-white p-2 w-full">
        <p>Pareve ({cookbook["pareve"]} recipes)</p>
      </div>
    </div>
  );
};

export default TodoList;
