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

export const getUserIdByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();
  if (error || !data) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};

export const getUserById = async (user_id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user_id)
    .single();
  if (error || !data) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  console.log("Friend ID", data);
  return data;
};

export const findExistingReq = async (user_id: string, friend_id: string) => {
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

export const createRequest = async (friendId: string) => {
  const user = await supabase.auth.getUser();
  const user_id = user.data.user?.id || "";
  const { data, error } = await supabase.from("friendships").insert({
    requester_id: user_id,
    friend_id: friendId,
  });
  if (error || !data) {
    console.error(error);
    return null; // False?
  }
  console.log("New friendship:", data);
  return data;
};

// export const deleteRequest = async (friendId: string) => {
//   const user = await supabase.auth.getUser();
//   const user_id = user.data.user?.id || "";
//   const { data, error } = await supabase.from("friendships").delete().match({
//     requester_id: user_id,
//     friend_id: friendId,
//   });
//   if (error || !data) {
//     console.error(error);
//     return null; // False?
//   }
//   console.log("Friendship deleted:", data);
//   return data;
// };
