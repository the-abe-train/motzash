import { createEffect, createResource, createSignal, For, on } from "solid-js";
import { createStore } from "solid-js/store";
import { loadRecipe } from "../../util/queries";
import { supabase } from "../../util/supabase";

const CookbookWidget: WidgetComponent = (props) => {
  // Signals and stores
  const [metadata, setMetadata] = createStore({
    id: 0,
    servings: 2,
    prep_time: 30,
  });
  const [ingredients, setIngredients] = createStore<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = createStore({
    ingredient: "",
    amount: 0,
    unit: "",
  });
  const [instructions, setInstructions] = createStore<Instruction[]>([]);
  const [newInstruction, setNewInstruction] = createStore({
    step: 0,
    text: "",
  });
  const [msg, setMsg] = createSignal("");

  // Instruction sorting
  const sortInstrutions = (change?: {
    newItem?: Instruction[];
    deleteItem?: number;
  }) => {
    setInstructions((prev) => {
      const addedSteps = change?.newItem
        ? [...prev, ...change?.newItem]
        : [...prev];
      const removedSteps = addedSteps.filter(
        (i) => i.id !== change?.deleteItem
      );
      const sortedSteps = removedSteps.sort((a, z) => {
        if (a.step === z.step) return -1;
        return (a.step || 0) - (z.step || 0);
      });
      const reducedSteps = sortedSteps.map((step, idx) => {
        return { ...step, step: idx + 1 };
      });
      return reducedSteps;
    });
  };

  // Load recipe data
  const [loadedRecipe, { refetch }] = createResource(
    props.widget.id,
    loadRecipe
  );
  createEffect(
    on(loadedRecipe, () => {
      if (loadedRecipe.state === "ready") {
        const returnedValue = loadedRecipe();
        if (
          returnedValue &&
          returnedValue.recipe_metadata &&
          returnedValue.recipe_ingredients &&
          returnedValue.recipe_instructions
        ) {
          setIngredients(returnedValue.recipe_ingredients);
          sortInstrutions({ newItem: returnedValue.recipe_instructions });
          setNewInstruction("step", instructions.length + 1);
          const { id, servings, prep_time } = returnedValue?.recipe_metadata[0];
          setMetadata({
            id,
            servings: servings || 2,
            prep_time: prep_time || 30,
          });
        }
      }
    })
  );

  // Functions
  function updateMsg() {
    setMsg("Recipe updated!");
    setTimeout(() => setMsg(""), 3000);
  }

  async function createNewIngredient(e: Event) {
    e.preventDefault();
    const { error } = await supabase.from("recipe_ingredients").insert({
      widget_id: props.widget.id,
      ...newIngredient,
    });
    if (error) {
      console.error(error.message);
      refetch();
    }
    setIngredients((prev) => [
      ...prev,
      { ...newIngredient, id: 0, updated_at: "", widget_id: props.widget.id },
    ]);
    setNewIngredient({ ingredient: "", amount: 0, unit: "" });
    updateMsg();
    return;
  }

  async function addInstruction(e: Event) {
    e.preventDefault();
    const { error } = await supabase.from("recipe_instructions").insert({
      widget_id: props.widget.id,
      ...newInstruction,
    });
    if (error) {
      console.error(error.message);
      refetch();
    }
    sortInstrutions({
      newItem: [
        {
          ...newInstruction,
          id: 0,
          updated_at: "",
          widget_id: props.widget.id,
        },
      ],
    });
    setNewInstruction({ step: instructions.length + 1, text: "" });
    updateMsg();
    return;
  }

  async function updateMetadata(
    e: Event,
    newData: { id: number; servings: number; prep_time: number }
  ) {
    e.preventDefault();
    const { error } = await supabase
      .from("recipe_metadata")
      .update(newData)
      .eq("id", metadata.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    updateMsg();
  }

  async function updateIngredient(e: Event, ing: Ingredient) {
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
    updateMsg();
  }

  async function updateInstruction(e: Event, inst: Instruction) {
    e.preventDefault();
    const { error } = await supabase
      .from("recipe_instructions")
      .update(inst)
      .eq("id", inst.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    sortInstrutions();
    updateMsg();
  }

  async function deleteIngredient(e: Event, ing: Ingredient) {
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
    updateMsg();
  }

  async function deleteInstruction(e: Event, inst: Instruction) {
    e.preventDefault();
    const { error } = await supabase
      .from("recipe_instructions")
      .delete()
      .eq("id", inst.id);
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    sortInstrutions({ deleteItem: inst.id });
    updateMsg();
  }

  async function deleteRecipe(e: Event) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this recipe?")) {
      const { error } = await supabase
        .from("widgets")
        .delete()
        .eq("id", props.widget.id);
      if (error) {
        console.error(error.message);
        setMsg("Failed to delete recipe. Please contact support.");
        refetch();
        return;
      }
      props.setActiveWidget(null);
    }
  }

  return (
    <div class="w-full">
      <h2 class="text-2xl font-header">{props.widget.name}</h2>
      <form
        class="flex space-x-1"
        onSubmit={(e) => updateMetadata(e, metadata)}
      >
        <input
          type="number"
          class="w-4 bg-transparent text-right"
          value={metadata.servings}
          onChange={(e) =>
            setMetadata("servings", parseInt(e.currentTarget.value))
          }
        />
        <span class="mx-1">servings,</span>
        <input
          type="number"
          class="w-8 bg-transparent text-right"
          value={metadata.prep_time}
          onChange={(e) =>
            setMetadata("prep_time", parseInt(e.currentTarget.value))
          }
        />
        <span class="mx-1">min</span>
        <button type="submit">&#8593;</button>
      </form>
      <div class="my-4">
        <h3 class="text-xl font-header my-1">Ingredients</h3>
        <div class="flex space-x-2 font-bold">
          <span class="w-14">Amount</span>
          <span class="w-14">Unit</span>
          <span class="w-40">Ingredient</span>
        </div>
        <For each={ingredients}>
          {(ing, idx) => {
            return (
              <form
                class="flex space-x-2 w-full"
                onSubmit={(e) => updateIngredient(e, ing)}
              >
                <input
                  name="amount"
                  class="bg-transparent w-14"
                  value={ing.amount || 0}
                  type="number"
                  step="0.01"
                  onChange={(e) =>
                    setIngredients(
                      idx(),
                      "amount",
                      parseFloat(e.currentTarget.value)
                    )
                  }
                />
                <input
                  name="unit"
                  class="bg-transparent w-14"
                  value={ing.unit || ""}
                  onChange={(e) =>
                    setIngredients(idx(), "unit", e.currentTarget.value)
                  }
                />
                <input
                  name="ingredient"
                  class="bg-transparent w-40 flex-grow"
                  value={ing.ingredient || ""}
                  onChange={(e) =>
                    setIngredients(idx(), "ingredient", e.currentTarget.value)
                  }
                />
                <button type="button" onClick={(e) => deleteIngredient(e, ing)}>
                  &#10006;
                </button>
                <button type="submit">&#8593;</button>
              </form>
            );
          }}
        </For>
        <form onSubmit={createNewIngredient} class="w-full max-w-lg my-2">
          <div class="flex w-full justify-between space-x-2">
            <input
              class="border w-14 border-black px-1"
              type="number"
              name="amount"
              required
              value={newIngredient.amount}
              onInput={(e) =>
                setNewIngredient("amount", parseFloat(e.currentTarget.value))
              }
            />
            <input
              class="border w-14 border-black px-1"
              type="text"
              name="unit"
              required
              value={newIngredient.unit}
              onInput={(e) => setNewIngredient("unit", e.currentTarget.value)}
            />
            <input
              class="border border-black w-40 px-1 flex-grow"
              type="text"
              name="ingredient"
              required
              value={newIngredient.ingredient}
              onInput={(e) =>
                setNewIngredient("ingredient", e.currentTarget.value)
              }
            />
          </div>
          <button
            type="submit"
            class="w-fit py-1 px-2 border border-black rounded my-2
          bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
          >
            Add new
          </button>
        </form>
      </div>
      <div class="my-4 space-y-4">
        <h3 class="text-xl font-header my-1">Instructions</h3>
        <For each={instructions}>
          {(inst, idx) => {
            return (
              <form
                class="flex space-x-2 w-full"
                onSubmit={(e) => updateInstruction(e, inst)}
              >
                <input
                  name="step"
                  class="bg-transparent w-14"
                  value={inst.step || 0}
                  type="number"
                  onChange={(e) =>
                    setInstructions(
                      idx(),
                      "step",
                      parseInt(e.currentTarget.value)
                    )
                  }
                />
                <textarea
                  name="instruction"
                  class="bg-transparent flex-grow min-h-fit"
                  value={inst.text || ""}
                  onChange={(e) =>
                    setInstructions(idx(), "text", e.currentTarget.value)
                  }
                />
                <button
                  type="button"
                  onClick={(e) => deleteInstruction(e, inst)}
                >
                  &#10006;
                </button>
                <button type="submit">&#8593;</button>
              </form>
            );
          }}
        </For>
        <form onSubmit={addInstruction} class="w-full max-w-lg my-2">
          <div class="flex w-full justify-between space-x-2">
            <input
              class="border border-black w-14 px-1"
              type="number"
              name="step"
              min={1}
              required
              value={newInstruction.step}
              onInput={(e) =>
                setNewInstruction("step", parseInt(e.currentTarget.value))
              }
            />
            <textarea
              class="border border-black flex-grow px-1"
              name="text"
              required
              value={newInstruction.text}
              onChange={(e) => setNewInstruction("text", e.currentTarget.value)}
              minLength="10"
            />
          </div>
          <button
            type="submit"
            class="w-fit py-1 px-2 border border-black rounded my-2
          bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
          >
            Add new
          </button>
        </form>
      </div>
      <p class="my-8">{msg()}</p>
      <button
        class="w-max py-1 px-2 border rounded my-6
          bg-none text-coral2 border-coral2"
        onClick={deleteRecipe}
      >
        Delete recipe
      </button>
    </div>
  );
};

export default CookbookWidget;
