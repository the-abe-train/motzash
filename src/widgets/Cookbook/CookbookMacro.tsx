import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { loadAllRecipes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const CookbookMacro: WidgetPreviewComponent = (props) => {
  const [loadedRecipes, { refetch }] = createResource(loadAllRecipes, {
    initialValue: [],
  });
  const [meatRecipes, setMeatRecipes] = createStore<Recipe[]>([]);
  const [dairyRecipes, setDairyRecipes] = createStore<Recipe[]>([]);
  const [pareveRecipes, setPareveRecipes] = createStore<Recipe[]>([]);

  const data = [
    { name: "Meat", recipes: meatRecipes, setRecipes: setMeatRecipes },
    { name: "Dairy", recipes: dairyRecipes, setRecipes: setDairyRecipes },
    { name: "Pareve", recipes: pareveRecipes, setRecipes: setPareveRecipes },
  ];

  createEffect(() => {
    if (loadedRecipes.state === "ready") {
      const returnedValue = loadedRecipes();
      if (returnedValue) {
        setMeatRecipes(returnedValue.filter((w) => w.type === "meat_recipe"));
        setDairyRecipes(returnedValue.filter((w) => w.type === "dairy_recipe"));
        setPareveRecipes(
          returnedValue.filter((w) => w.type === "pareve_recipe")
        );
      }
    }
  });

  const [loading, setLoading] = createSignal(false);
  const [inputName, setInputName] = createSignal("");
  const [msg, setMsg] = createSignal("");

  async function createNewWidget(e: Event, name: string) {
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
      props.setActiveWidget(data[0]);
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
              <Switch fallback={<p>Loading cookbook...</p>}>
                <Match when={loadedRecipes.state !== "ready"}>
                  <p>Loading recipes...</p>
                </Match>
                <Match when={recipeList.recipes.length === 0}>
                  <p>No {recipeList.name} recipes</p>
                </Match>
                <Match when={recipeList.recipes.length > 0}>
                  <For each={recipeList.recipes}>
                    {(recipe) => {
                      let metaString = "";
                      if (
                        recipe.recipe_metadata &&
                        recipe.recipe_metadata?.length > 0
                      ) {
                        const metadata = recipe.recipe_metadata[0];
                        metaString = `(${metadata.servings} servings, ${metadata.prep_time} min)`;
                      }
                      return (
                        <li
                          class="cursor-pointer"
                          onClick={() => props.setActiveWidget(recipe)}
                        >
                          {recipe.name} {metaString}
                        </li>
                      );
                    }}
                  </For>
                </Match>
              </Switch>
              <form
                onSubmit={(e) => createNewWidget(e, recipeList.name)}
                class="m-4 p-4 flex flex-col space-y-4"
              >
                <input
                  type="text"
                  value={inputName()}
                  onChange={(e) => setInputName(e.currentTarget.value)}
                  class="w-fit p-2"
                  required
                  minLength={6}
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
