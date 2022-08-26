import { Database } from "../lib/database.types";
import { supabase } from "./supabase";

export const loadWidgets = async (type: string) => {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  // console.log(type);
  const { data, error } = await supabase
    .from("widgets")
    .select("*")
    .eq("user_id", user_id);
  // .match({ user_id, type });
  if (error) {
    if (error.code === "PGRST116") return null;
    console.log(error);
    return null;
  }
  console.log(data);
  return data;
};

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
  return data as MyStatus;
};

// TODO I'm worried that unaccpeted friends' statuses will be in the payload
export const loadFriendStatuses = async () => {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";

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
    console.error(error);
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

  console.log(acceptedRequests);

  return acceptedRequests;
};

// new_col_object:from_col (join_table_cols[])
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
