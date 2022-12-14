import { greg } from "@hebcal/core";
// import { havdalahTimestamp } from "./datetime";
import { supabase } from "./supabase";

export const loadProfile = async (user_id: string) => {
  let { data, error, status } = await supabase
    .from("profiles")
    .select("username, email")
    .eq("id", user_id)
    .single();
  if (error && status !== 406) {
    throw error;
  }
  if (!data || error) {
    throw error;
  }
  return data;
};

export const loadWidgets = async (user_id: string) => {
  const { data, error } = await supabase
    .from("widgets")
    .select("*, profiles (username)")
    .eq("user_id", user_id)
    .limit(12);
  if (error) {
    if (error.code === "PGRST116") return null;
    return null;
  }
  return data as Widget[];
};

export const loadTodoLists = async (user_id: string) => {
  const { data, error } = await supabase
    .from("widgets")
    .select("*, todos (*)")
    .match({ type: "todo", user_id });
  if (error) {
    if (error.code === "PGRST116") return null;

    return null;
  }
  return data as TodoList[];
};

export const loadTodos = async (widget_id: number) => {
  const { data, error } = await supabase
    .from("todos")
    .select()
    .eq("widget_id", widget_id);
  if (error) {
    if (error.code === "PGRST116") return null;

    return null;
  }
  return data as Todo[];
};

export const loadAllRecipes = async (user_id: string) => {
  const { data, error } = await supabase
    .from("widgets")
    .select("*, recipe_metadata (*)")
    .eq("user_id", user_id)
    .in("type", ["meat_recipe", "dairy_recipe", "pareve_recipe"]);
  if (error) {
    if (error.code === "PGRST116") return null;

    return null;
  }
  return data as Recipe[];
};

export const loadRecipe = async (widget_id: number) => {
  const { data, error } = await supabase
    .from("widgets")
    .select(
      "*, recipe_metadata (*), recipe_ingredients (*), recipe_instructions (*)"
    )
    .eq("id", widget_id)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;

    return null;
  }
  data;
  return data as Recipe;
};

export const loadPolls = async () => {
  const { data, error } = await supabase
    .from("widgets")
    .select("*, poll_votes (*), profiles (username)")
    .gte("poll_votes.havdalah", greg.greg2abs(new Date()))
    .eq("type", "poll");
  if (error) {
    if (error.code === "PGRST116") return null;
    return null;
  }
  console.log(data);
  return data as Poll[];
};

export const loadVotes = async (widget_id: number) => {
  const { data, error } = await supabase
    .from("poll_votes")
    .select()
    .gte("havdalah", greg.greg2abs(new Date()))
    .eq("widget_id", widget_id);
  if (error) {
    return null;
  }
  return data as Vote[];
};

export const loadMyStatus = async (user_id: string) => {
  const { data, error } = await supabase
    .from("statuses")
    .select("text, city")
    .eq("user_id", user_id)
    .gte("havdalah", greg.greg2abs(new Date()))
    .single();
  if (error) {
    return null;
  }
  return data;
};

export const loadStatuses = async () => {
  const { data, error } = await supabase
    .from("statuses")
    .select("*, profiles (username)")
    .gte("havdalah", greg.greg2abs(new Date()));
  if (error) {
    return [];
  }
  return data as FriendStatus[];
};

// new_col_object:from_col (join_table_cols[])
export const loadRequestsToMe = async (user_id: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .select("*, requester:requester_id (id, username)")
    .match({ friend_id: user_id, accepted: false });
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data as FriendRequest[];
};

export async function getUserProfile(info: Profile) {
  const key = Object.keys(info)[0] as keyof Profile;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq(key, info[key])
    .single();
  if (error || !data) {
    console.error("No user found with this info.", info);
    return null;
  }
  return data;
}

export const findFriendship = async (user_id: string, friend_id: string) => {
  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .or(
      `\
    and(requester_id.eq.${user_id},friend_id.eq.${friend_id}),\
    and(requester_id.eq.${friend_id},friend_id.eq.${user_id})\
    `
    )
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};

export async function createRequest(friendInfo: Profile, user_id: string) {
  let friend_id = friendInfo["id"];
  if (!friend_id) {
    const friend = await getUserProfile(friendInfo);
    friend_id = friend?.id;
  }
  if (!friend_id) {
    console.log("Cannot create friendship, no friend id found.");
    return false;
  }
  const { error } = await supabase.from("friendships").insert({
    requester_id: user_id,
    friend_id,
  });
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}

export const deleteRequest = async (user_id: string, info: Profile) => {
  let friend_id = info["id"];
  if (!friend_id) {
    const friend = await getUserProfile(info);
    friend_id = friend?.id;
  }
  const { error, count } = await supabase
    .from("friendships")
    .delete()
    .or(
      `\
    and(requester_id.eq.${user_id},friend_id.eq.${friend_id}),\
    and(requester_id.eq.${friend_id},friend_id.eq.${user_id})\
    `
    );
  if (error) {
    console.error(error);
    return false; // False or null?
  }
  return true;
};
