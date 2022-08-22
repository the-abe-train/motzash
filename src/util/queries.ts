import { Database } from "../lib/database.types";
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
  // TODO should only pull in friends's statuses, not all statuses
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
  console.log("Friend requests:", data);
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
  console.log("Friendships:", data);
  return data;
};

export async function createRequest(info: UserInfo) {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
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
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  let friend_id = info["id"];
  if (!friend_id) {
    const friend = await getUser(info);
    friend_id = friend?.id;
  }
  console.log("friend_id", user_id);
  console.log("requester_id", friend_id);
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
