import { createEffect, createResource, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { loadRecipe } from "../../util/queries";
import { supabase } from "../../util/supabase";

const CookbookWidget: WidgetComponent = (props) => {
  // Load recipe data
  const [loadedRecipe, { refetch }] = createResource(async () =>
    loadRecipe(props.widget.id)
  );
  createEffect(() => {
    if (loadedRecipe.state === "ready") {
      const returnedValue = loadedRecipe();
      if (returnedValue && returnedValue.recipe_ingredients) {
        setIngredients(returnedValue.recipe_ingredients);
      }
    }
  });

  const [ingredients, setIngredients] = createStore<Ingreident[]>([]);
  const [newIngredient, setNewIngredient] = createSignal("");
  const [newAmount, setNewAmount] = createSignal(0);
  const [newUnit, setNewUnit] = createSignal("");

  async function createNewIngredient(e: Event) {
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    console.log("Widget id:", props.widget.id);
    console.log("User id:", user_id);

    const { data, error } = await supabase
      .from("recipe_ingredients")
      .insert({
        widget_id: props.widget.id,
        ingredient: newIngredient(),
        amount: newAmount(),
        unit: newUnit(),
      })
      .select();
    if (data) {
      setIngredients((prev) => [...prev, ...data]);
      setNewIngredient("");
      return;
    }
    if (error) {
      console.error(error.message);
    }
    setNewIngredient("");
    refetch();
  }

  async function updateIngredient(e: Event, ing: Ingreident) {
    e.preventDefault();
    const { error } = await supabase
      .from("recipe_ingredients")
      .update(ing)
      .eq("id", ing.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== ing.id));
  }

  async function deleteIngredient(e: Event, ing: Ingreident) {
    e.preventDefault();
    const { error } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("id", ing.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    setIngredients((prev) => prev.filter((i) => i.id !== ing.id));
  }

  return (
    <div>
      <h2 class="text-lg">{props.widget.name}</h2>
      <div>
        <h3>Ingredients</h3>
        <For each={ingredients}>
          {(ing, idx) => {
            return (
              <form
                onSubmit={(e) => updateIngredient(e, ing)}
                class="flex space-x-2"
              >
                <input value={ing.ingredient || ""} class="bg-transparent" />
                <button type="button" onClick={(e) => deleteIngredient(e, ing)}>
                  &#10006;
                </button>
              </form>
            );
          }}
        </For>
        <form onSubmit={createNewIngredient} class="flex flex-col space-y-3">
          <div class="flex space-x-2">
            <label for="ingredient">Ingredient</label>
            <input
              class="border"
              type="text"
              name="ingredient"
              required
              value={newIngredient()}
              onInput={(e) => setNewIngredient(e.currentTarget.value)}
            />
          </div>
          <div class="flex space-x-2">
            <label for="amount">Amount</label>
            <input
              class="border"
              type="number"
              name="amount"
              required
              value={newAmount()}
              onInput={(e) => setNewAmount(parseInt(e.currentTarget.value))}
            />
          </div>
          <div class="flex space-x-2">
            <label for="unit">Unit</label>
            <input
              class="border"
              type="text"
              name="unit"
              required
              value={newUnit()}
              onInput={(e) => setNewUnit(e.currentTarget.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h3>Instructions</h3>
        <ol>
          <li>Step 1</li>
        </ol>
      </div>
    </div>
  );
};

export default CookbookWidget;
