import { supabase } from "../../util/supabase";

export async function uploadIngredient(
  widget_id: number,
  ingredient: string,
  amount: number,
  unit: string
) {
  const { data, error } = await supabase
    .from("recipe_ingredients")
    .insert({
      widget_id,
      ingredient,
      amount,
      unit,
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
