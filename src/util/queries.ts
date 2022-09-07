import { useContext } from "solid-js";
import { AuthContext } from "../context/auth";
import { Database } from "../lib/database.types";
import { supabase } from "./supabase";

export const loadProfile = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  let { data, error, status } = await supabase
    .from("profiles")
    .select(`username, email`)
    .eq("id", user_id)
    .single();
  if (error && status !== 406) {
    console.log(error);
    throw error;
  }
  if (!data || error) {
    console.log(error);
    throw error;
  }
  return data;
};

export const loadWidgets = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  const { data, error } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  return data;
};

export const loadTodos = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  const { data, error } = await supabase
    .from("todos")
    .select("*, widgets!inner(*)")
    .match({ "widgets.user_id": user_id, type: "todo" });
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  return data;
};

export const loadAllRecipes = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  const { data, error } = await supabase
    .from("widgets")
    .select("*, recipe_metadata (*)")
    .eq("user_id", user_id)
    .in("type", ["meat_recipe", "dairy_recipe", "pareve_recipe"]);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
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
    console.log(error);
    return null;
  }
  console.log(data);
  return data as Recipe;
};

export const loadPolls = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  const { data, error } = await supabase
    .from("widgets")
    .select(
      `
    *, 
    profiles!inner (
      username, 
      friend:friendships!requester_id (
        accepted, friend_id, requester_id
      ),      
      requester:friendships!friend_id (
        accepted, friend_id, requester_id
      )      
    )
    `
    )
    .or(`friend_id.eq.${user_id},requester_id.eq.${user_id}`, {
      foreignTable: "profiles.friend",
    })
    .or(`friend_id.eq.${user_id},requester_id.eq.${user_id}`, {
      foreignTable: "profiles.requester",
    })
    .match({
      "profiles.friend.accepted": true,
      "profiles.requester.accepted": true,
      type: "poll",
    });
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  console.log("Friends polls", data);
  return data;
};

export const loadVotes = async (widget_id: number) => {
  const { data, error } = await supabase
    .from("poll_votes")
    .select("*")
    .eq("widget_id", widget_id);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  console.log(data);
  return data as Vote[];
};

export const loadMyStatus = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
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
  return data as MyStatus;
};

// TODO I'm worried that unaccpeted friends' statuses will be in the payload
export const loadFriendStatuses = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";

  // Could use !inner for better query but it doesn't work with friend & requester :(
  const { data, error } = await supabase
    .from("statuses")
    .select(
      `
    *, 
    profiles!inner (
      username, 
      friend:friendships!requester_id (
        accepted, friend_id, requester_id
      ),      
      requester:friendships!friend_id (
        accepted, friend_id, requester_id
      )      
    )
    `
    )
    .or(`friend_id.eq.${user_id},requester_id.eq.${user_id}`, {
      foreignTable: "profiles.friend",
    })
    .or(`friend_id.eq.${user_id},requester_id.eq.${user_id}`, {
      foreignTable: "profiles.requester",
    })
    .eq("profiles.friend.accepted", true)
    .eq("profiles.requester.accepted", true)
    .neq("user_id", user_id);

  if (error) {
    if (error.code === "PGRST116") return null;
    return null;
  }

  const x = data as FriendStatus[];

  const acceptedRequests = x.filter((row) => {
    const profiles = row.profiles;
    return (
      profiles.friend.some((f) => f.accepted) ||
      profiles.requester.some((r) => r.accepted)
    );
  });
  return acceptedRequests;
};

// new_col_object:from_col (join_table_cols[])
export const loadRequestsToMe = async () => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
    *, 
    requester:requester_id (id, username),
    friend:friend_id (id, username)
    `
    )
    .eq("friend_id", user_id)
    .eq("accepted", false);
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};

type UserInfo = Database["public"]["Tables"]["profiles"]["Update"];

export async function getUser(info: UserInfo) {
  const key = Object.keys(info)[0] as keyof UserInfo;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq(key, info[key])
    .single();
  if (error || !data) {
    if (error.code === "PGRST116") return null;
    console.error(error);
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

export async function createRequest(info: UserInfo) {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  let friend_id = info["id"];
  if (!friend_id) {
    const friend = await getUser(info);
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

export const deleteRequest = async (info: UserInfo) => {
  const session = useContext(AuthContext);
  const user_id = session()?.user.id || "";
  let friend_id = info["id"];
  if (!friend_id) {
    const friend = await getUser(info);
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
    return false; // False?
  }
  return true;
};
