import { supabase } from "./supabase";

export const loadMyStatus = async () => {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  const { data, error } = await supabase
    .from("statuses")
    .select("*, profiles (username)")
    .eq("user_id", user_id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  return data;
};

export const loadFriendStatuses = async () => {
  const { data, error } = await supabase
    .from("statuses")
    .select("*, profiles (username)");
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};
