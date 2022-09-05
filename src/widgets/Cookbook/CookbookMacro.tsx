import { createSignal, For, Show } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { supabase } from "../../util/supabase";

const CookbookMacro: WidgetPreviewComponent = (props) => {
  const [meatRecipes, setMeatRecipes] = createStore<Widget[]>(
    props.widgets.filter((w) => w.type === "meat_recipe")
  );
  const [dairyRecipes, setDairyRecipes] = createStore<Widget[]>(
    props.widgets.filter((w) => w.type === "dairy_recipe")
  );
  const [pareveRecipes, setPareveRecipes] = createStore<Widget[]>(
    props.widgets.filter((w) => w.type === "pareve_recipe")
  );

  const data = [
    { name: "Meat", recipes: meatRecipes, setRecipes: setMeatRecipes },
    { name: "Dairy", recipes: dairyRecipes, setRecipes: setDairyRecipes },
    { name: "Pareve", recipes: pareveRecipes, setRecipes: setPareveRecipes },
  ];

  const [loading, setLoading] = createSignal(false);
  const [inputName, setInputName] = createSignal("");
  const [msg, setMsg] = createSignal("");

  async function createNewWidget(
    e: Event,
    name: string,
    setRecipeList: SetStoreFunction<Widget[]>
  ) {
    e.preventDefault();
    setLoading(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const recipeType = `${name.toLowerCase()}_recipe` as WidgetType;
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: inputName(),
        user_id,
        type: recipeType,
      })
      .select();
    if (data) {
      await supabase.from("recipe_metadata").insert({
        widget_id: data[0].id,
      });
      setRecipeList((prev) => (prev ? [...prev, ...data] : data));
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
    <div class="flex flex-col space-y-4">
      <For each={data}>
        {(recipeList) => {
          return (
            <div>
              <h2>{recipeList.name}</h2>
              <For each={recipeList.recipes}>
                {(recipe) => {
                  return (
                    <li
                      class="cursor-pointer"
                      onClick={() => props.setActiveWidget(recipe)}
                    >
                      {recipe.name}
                    </li>
                  );
                }}
              </For>
              <Show when={recipeList.recipes.length === 0}>
                <p>No {recipeList.name} recipes</p>
              </Show>
              <form
                onSubmit={(e) =>
                  createNewWidget(e, recipeList.name, recipeList.setRecipes)
                }
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
                  Add new recipe
                </button>
              </form>
            </div>
          );
        }}
      </For>
    </div>
  );
};

export default CookbookMacro;
