import { RealtimeSubscription } from "@supabase/supabase-js";
import {
  Component,
  Switch,
  Match,
  useContext,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth";
import { createSync } from "../util/realtime";
import { supabase } from "../util/supabase";

type Profile = {
  id: string;
  updated_at: string;
  username: string;
  handle: string;
};

const loadProfile = async () => {
  const user = supabase.auth.user();

  let { data, error, status } = await supabase
    .from<Profile>("profiles")
    .select(`username, handle`)
    .eq("id", user?.id || "")
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
  const [profile, setProfile] = createStore<Profile>({
    id: "",
    updated_at: "",
    username: "",
    handle: "",
  });

  let subscription: RealtimeSubscription | null;

  const sync = createSync(setProfile, loadProfile);

  onMount(() => {
    subscription = supabase
      .from<Profile>("profiles")
      .on("UPDATE", (payload) => {
        setMsg("Profile updated!");
      })
      .subscribe();
  });

  onCleanup(() => {
    console.log("clean up");
    subscription?.unsubscribe();
  });

  const updateProfile = async (e: Event) => {
    e.preventDefault();

    try {
      const user = supabase.auth.user();

      const updates = {
        id: user?.id || "",
        username: profile.username || "",
        handle: profile.handle || "",
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").update(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

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
        <Match when={sync.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!sync.loading}>
          <form onSubmit={updateProfile} class="flex flex-col space-y-3">
            <div>Email: {session()?.user?.email || "no email set"}</div>
            <div class="space-x-2">
              <label for="username">Name</label>
              <input
                id="username"
                class="border py-1 px-2"
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    username: e.currentTarget.value,
                  }))
                }
              />
            </div>
            <div class="space-x-2">
              <label for="handle">Handle</label>
              <input
                id="handle"
                class="border py-1 px-2"
                type="text"
                value={profile.handle}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    username: e.currentTarget.value,
                  }))
                }
              />
            </div>
            <div>
              <button
                type="submit"
                class=" rounded p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                disabled={sync.loading}
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
