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
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  const { data, error } = await supabase
    .from("statuses")
    .select("*, profiles (username)")
    .neq("user_id", user_id);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};

// from_col_alias:from_col (join_col)
export const loadRequestsToMe = async () => {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  console.log(user_id);
  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
    *, 
    requester:requester_id (username),
    friend:friend_id (username)
    `
    )
    .eq("friend_id", user_id)
    .eq("accepted", false);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  console.log("Friend requests:", data);
  return data;
};
