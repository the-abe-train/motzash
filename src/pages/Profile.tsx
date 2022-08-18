import {
  Component,
  Switch,
  Match,
  useContext,
  createSignal,
  onMount,
  onCleanup,
  createResource,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth";
import { Database } from "../lib/database.types";
import { supabase } from "../util/supabase";

const loadProfile = async () => {
  const user = await supabase.auth.getUser();

  let { data, error, status } = await supabase
    .from("profiles")
    .select(`username, handle`)
    .eq("id", user.data.user?.id || "")
    .single();
  if (error && status !== 406) {
    console.log(error);
    throw error;
  }
  if (!data || error) {
    console.log(error);
    throw error;
  }
  console.log("load data", data);
  return data;
};

const Profile: Component = () => {
  const [msg, setMsg] = createSignal("");
  const [newProfile, setNewProfile] = createStore<
    Database["public"]["Tables"]["profiles"]["Row"]
  >({
    id: "",
    updated_at: "",
    username: "",
    handle: "",
  });

  // const sync = createSync(setNewProfile, loadProfile);
  const [profile, { refetch }] = createResource(loadProfile);

  // Start off with defaults
  createEffect(() => {
    const returnedValue = profile();
    if (returnedValue) setNewProfile(() => returnedValue);
  });

  onMount(() => {
    supabase
      .channel("public:profiles")
      // .channel("*")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          console.log("Subscription activated");
          setMsg("Profile updated!");
          refetch();
        }
      )
      .subscribe();
  });

  // onCleanup(() => {
  //   supabase.removeAllChannels();
  // });

  const updateProfile = async (e: Event) => {
    e.preventDefault();

    try {
      const user = await supabase.auth.getUser();

      const updates: Record<string, any> = { updated_at: new Date() };
      if (newProfile.username) updates["username"] = newProfile.username;
      if (newProfile.handle) updates["handle"] = newProfile.handle;

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .match({ id: user.data.user?.id });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message || "Database error.");
    }
  };

  const session = useContext(AuthContext);

  return (
    <main class="flex-grow p-4">
      <Switch>
        <Match when={profile.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!profile.loading}>
          <form onSubmit={updateProfile} class="flex flex-col space-y-3">
            <div>Email: {session()?.user?.email || "no email set"}</div>
            <div class="space-x-2">
              <label for="username">Name</label>
              <input
                id="username"
                class="border py-1 px-2"
                type="text"
                value={newProfile.username || ""}
                onChange={(e) =>
                  setNewProfile("username", e.currentTarget.value)
                }
              />
            </div>
            <div class="space-x-2">
              <label for="handle">Handle</label>
              <input
                id="handle"
                class="border py-1 px-2"
                type="text"
                value={newProfile.handle || ""}
                onChange={(e) => setNewProfile("handle", e.currentTarget.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                class=" rounded p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                disabled={profile.loading}
              >
                Update profile
              </button>
            </div>
          </form>
          <p>{msg()}</p>
          <button
            type="button"
            class=" rounded p-2 my-2
        bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </Match>
      </Switch>
    </main>
  );
};

export default Profile;
