import {
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth";
import { loadAllRecipes } from "../../util/queries";
import { supabase } from "../../util/supabase";

import StarSolid from "../../assets/icons/Star Solid.svg";
import StarEmpty from "../../assets/icons/Star Empty.svg";

const CookbookMacro: WidgetPreviewComponent = (props) => {
  const session = useContext(AuthContext);
  const [loadedRecipes, { refetch }] = createResource(loadAllRecipes, {
    initialValue: [],
  });

  const [recipes, setRecipes] = createStore<Recipe[]>([]);

  createEffect(
    on(loadedRecipes, () => {
      if (loadedRecipes.state === "ready") {
        const returnedValue = loadedRecipes();
        if (returnedValue) {
          setRecipes(returnedValue);
        }
      }
    })
  );

  const [loading, setLoading] = createSignal(false);
  const [newRecipeName, setNewRecipeName] = createSignal("");
  const [newRecipeType, setNewRecipeType] = createSignal("meat");
  const [msg, setMsg] = createSignal("");

  // TODO stop recipe name from flashing in all text boxes
  async function createNewWidget(e: Event) {
    e.preventDefault();
    setLoading(true);
    const name = newRecipeName();
    setNewRecipeName("");
    const user_id = session()?.user.id || "";
    const recipeType = `${newRecipeType().toLowerCase()}_recipe` as WidgetType;
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name,
        user_id,
        type: recipeType,
      })
      .select();
    if (data) {
      // TODO should creating the metadata be done with a Postgres rule?
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
  }

  async function setFavourite(
    metadata_id: number,
    newValue: boolean,
    recipe_id: number
  ) {
    const { error } = await supabase.from("recipe_metadata").update({
      id: metadata_id,
      favourite: newValue,
      udpated_at: new Date().toISOString(),
    });
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
      refetch();
    }
    setRecipes((prev) => {
      const newRecipes = prev.map((recipe) => {
        const metadata = (recipe.recipe_metadata || [])[0] as
          | RecipeMetadata
          | undefined;
        if (metadata && recipe_id === recipe.id) {
          const newMetadata = { ...metadata, favourite: newValue };
          console.log("New metadata", newMetadata);
          return { ...recipe, recipe_metadata: [newMetadata] };
        }
        return { ...recipe };
      });
      return newRecipes as Recipe[];
    });
  }

  const recipeLists = () => {
    return [
      {
        type: "Meat",
        recipes: recipes.filter((recipe) => recipe.type === "meat_recipe"),
      },
      {
        type: "Dairy",
        recipes: recipes.filter((recipe) => recipe.type === "dairy_recipe"),
      },
      {
        type: "Pareve",
        recipes: recipes.filter((recipe) => recipe.type === "pareve_recipe"),
      },
    ];
  };

  return (
    <div class="flex flex-col space-y-6">
      <For each={recipeLists()}>
        {(recipeList) => {
          return (
            <div class="max-w-lg">
              <h2 class="font-header text-xl mb-1">{recipeList.type}</h2>
              <For
                each={recipeList.recipes}
                fallback={<p>No {recipeList.type} recipes</p>}
              >
                {(recipe) => {
                  const metadata = (recipe.recipe_metadata || [])[0];
                  let metaString = "";
                  let isFavourite = metadata?.favourite || false;
                  if (metadata) {
                    metaString = `(${metadata.servings} servings, ${metadata.prep_time} min)`;
                  }
                  return (
                    <div
                      class="cursor-pointer bg-ghost flex justify-between
                          border border-black drop-shadow-small px-3 py-1
                          hover:drop-shadow-none transition-all my-2"
                      onClick={() => props.setActiveWidget(recipe)}
                    >
                      <span>{recipe.name}</span>
                      <span class="hidden lg:inline">{metaString}</span>
                      <img
                        src={isFavourite ? StarSolid : StarEmpty}
                        alt="Star"
                        onClick={(e) => {
                          console.log("Current setting:", isFavourite);
                          setFavourite(metadata.id, !isFavourite, recipe.id);
                          e.stopPropagation();
                        }}
                      />
                    </div>
                  );
                }}
              </For>
            </div>
          );
        }}
      </For>
      <form onSubmit={createNewWidget} class="flex flex-col space-y-4 max-w-lg">
        <h1 class="font-header text-xl">Create new recipe</h1>
        <div class="flex space-x-3">
          <input
            type="text"
            value={newRecipeName()}
            onChange={(e) => setNewRecipeName(e.currentTarget.value)}
            class="px-2 py-1 flex-grow border border-black"
            required
            minLength={6}
          />
          <select
            class="border border-black"
            name="type"
            onChange={(e) => setNewRecipeType(e.currentTarget.value)}
          >
            <option value="meat">Meat</option>
            <option value="dairy">Dairy</option>
            <option value="pareve">Pareve</option>
          </select>
        </div>
        <button
          class="px-2 py-1 border border-black rounded drop-shadow-small w-fit mx-auto
              bg-ghost hover:drop-shadow-none transition-all"
          disabled={loading()}
          type="submit"
        >
          Add new recipe
        </button>
      </form>
    </div>
  );
};

export default CookbookMacro;
