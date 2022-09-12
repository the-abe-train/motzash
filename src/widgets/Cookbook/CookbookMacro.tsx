import {
  createEffect,
  createResource,
  createSignal,
  For,
  Index,
  Match,
  on,
  Switch,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth";
import { loadAllRecipes } from "../../util/queries";
import { supabase } from "../../util/supabase";

import StarSolid from "../../assets/Star Solid.svg";
import StarEmpty from "../../assets/Star Empty.svg";

const CookbookMacro: WidgetPreviewComponent = (props) => {
  const session = useContext(AuthContext);
  const [loadedRecipes, { refetch }] = createResource(loadAllRecipes, {
    initialValue: [],
  });

  const [data, setData] = createStore([
    { name: "Meat", recipes: [] as Recipe[] },
    { name: "Dairy", recipes: [] },
    { name: "Pareve", recipes: [] },
  ]);

  createEffect(
    on(loadedRecipes, () => {
      if (loadedRecipes.state === "ready") {
        const returnedValue = loadedRecipes();
        if (returnedValue) {
          const meatRecipes = returnedValue.filter(
            (w) => w.type === "meat_recipe"
          );
          const dairyRecipes = returnedValue.filter(
            (w) => w.type === "dairy_recipe"
          );
          const pareveRecipes = returnedValue.filter(
            (w) => w.type === "pareve_recipe"
          );
          setData([
            { name: "Meat", recipes: meatRecipes },
            { name: "Dairy", recipes: dairyRecipes },
            { name: "Pareve", recipes: pareveRecipes },
          ]);
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

  createEffect(() => {
    console.log("Re-rendering data");
    // console.log(data[0].recipes[0].recipe_metadata[0].favourite);
  });

  async function setFavourite(
    id: number,
    newValue: boolean,
    recipeType: number,
    recipeNumber: number
  ) {
    const { error } = await supabase.from("recipe_metadata").update({
      id,
      favourite: newValue,
      udpated_at: new Date().toISOString(),
    });
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
      refetch();
    }
    console.log("Favourite set!");
    setData(
      recipeType,
      "recipes",
      recipeNumber,
      "recipe_metadata",
      0,
      "favourite",
      (isFavourite) => !isFavourite
    );
    // setData((prev) => [...prev]);
    console.log(
      "New setting:",
      (data[recipeType].recipes[recipeNumber].recipe_metadata || [])[0]
        .favourite
    );
    // sortTodos();
    // refetch();
  }
  // Instruction sorting
  const sortTodos = (change?: {
    newItems?: Todo[];
    deleteItem?: Todo;
    changeItem?: Todo;
  }) => {
    console.log("Sorting todos");
    setData((prev) => {
      const newArray = [...prev];
      const sorted = newArray.sort((a, z) => {
        if (a.name && !z.name) {
          return 1;
        } else if (!a.name && z.name) {
          return -1;
        }
        return 1;
      });
      return sorted;
    });
  };

  return (
    <div class="flex flex-col space-y-6">
      <Index each={data}>
        {(recipeList, recipeType) => {
          console.log("Re-rendering");
          return (
            <div class="">
              <h1 class="font-header text-xl mb-1">{recipeList().name}</h1>
              <Switch fallback={<p>Loading cookbook...</p>}>
                <Match when={loadedRecipes.state !== "ready"}>
                  <p>Loading recipes...</p>
                </Match>
                <Match when={recipeList().recipes.length === 0}>
                  <p>No {recipeList.name} recipes</p>
                </Match>
                <Match when={recipeList().recipes.length > 0}>
                  <Index each={recipeList().recipes}>
                    {(recipe, recipeNumber) => {
                      const metadata = (recipe().recipe_metadata || [])[0];
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
                          // onClick={() => props.setActiveWidget(recipe)}
                        >
                          <span>{recipe().name}</span>
                          <span class="hidden lg:inline">{metaString}</span>
                          <img
                            src={isFavourite ? StarSolid : StarEmpty}
                            alt="Star"
                            onClick={(e) => {
                              console.log("Current setting:", isFavourite);
                              setFavourite(
                                metadata.id,
                                !isFavourite,
                                recipeType,
                                recipeNumber
                              );

                              // e.stopPropagation();
                            }}
                          />
                          {/* <svg
                            width="18"
                            height="16"
                            viewBox="0 0 18 16"
                            fill="transparent"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.35191 1.44329C8.5759 0.85252 9.42357 0.85252 9.64826 1.44329L11.0972 5.45692C11.1477 5.58766 11.2368 5.7 11.3525 5.77911C11.4682 5.85821 11.6052 5.90037 11.7454 5.9H15.3061C15.9641 5.9 16.2511 6.71896 15.7338 7.12004L13.1999 9.39984C13.0864 9.4871 13.0034 9.60806 12.963 9.74539C12.9225 9.88271 12.9265 10.0293 12.9745 10.1642L13.8999 14.0861C14.1253 14.7161 13.3959 15.2572 12.8443 14.8694L9.40257 12.6855C9.2847 12.6027 9.14415 12.5582 9.00008 12.5582C8.85602 12.5582 8.71547 12.6027 8.5976 12.6855L5.15586 14.8694C4.60498 15.2572 3.87491 14.7154 4.1003 14.0861L5.02566 10.1642C5.07366 10.0293 5.07771 9.88271 5.03722 9.74539C4.99672 9.60806 4.91378 9.4871 4.80027 9.39984L2.26638 7.12004C1.74841 6.71896 2.03679 5.9 2.69336 5.9H6.25411C6.3943 5.90046 6.53134 5.85835 6.64708 5.77923C6.76282 5.70011 6.85181 5.58772 6.90228 5.45692L8.35121 1.44329H8.35191Z"
                              stroke="#FFBC42"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg> */}
                        </div>
                      );
                    }}
                  </Index>
                </Match>
              </Switch>
            </div>
          );
        }}
      </Index>
      <form onSubmit={createNewWidget} class="flex flex-col space-y-4">
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
