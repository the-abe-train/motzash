import { supabase } from "./supabase";

export const loadMyStatus = async () => {
  // console.log("Loading data from database");
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from<ProfileStatus>("statuses")
    .select("*, profiles (username)")
    .eq("user_id", user?.id || "")
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  // console.log("new data", data);
  return data;
};
