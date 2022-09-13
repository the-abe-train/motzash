import {
  Component,
  Switch,
  Match,
  useContext,
  createSignal,
  createResource,
  createEffect,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth";
import { loadProfile } from "../util/queries";
import { supabase } from "../util/supabase";

const Profile: Component = () => {
  const session = useContext(AuthContext);
  const [msg, setMsg] = createSignal("");
  const [newProfile, setNewProfile] = createStore<Profile>({
    id: "",
    updated_at: "",
    username: "",
  });

  const [profile, { refetch }] = createResource(loadProfile);

  // Start off with defaults
  createEffect(() => {
    const returnedValue = profile();
    if (returnedValue) setNewProfile(() => returnedValue);
  });

  const [loading, setLoading] = createSignal(false);

  const updateProfile = async (e: Event) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updates: Record<string, any> = { updated_at: new Date() };
      if (newProfile.username) updates["username"] = newProfile.username;

      let { error } = await supabase
        .from("profiles")
        .update(updates)
        .match({ id: session?.user.id });

      if (error) {
        throw error;
      }
      setMsg("Profile updated!");
    } catch (error: any) {
      alert(error.message || "Database error.");
    }
    setLoading(false);
  };

  return (
    <main class="flex-grow p-4 space-y-4">
      <Switch>
        <Match when={profile.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!profile.loading}>
          <div>Email: {profile()?.email || "no email set"}</div>
          <form onSubmit={updateProfile} class="flex flex-col space-y-3">
            <div>
              <label for="username">Name</label>
              <input
                id="username"
                class="px-2 py-1 flex-grow border border-black"
                type="text"
                value={newProfile.username || ""}
                onChange={(e) =>
                  setNewProfile("username", e.currentTarget.value)
                }
              />
            </div>
            <button
              type="submit"
              class="w-max py-1 px-2 border border-black rounded
                bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
              disabled={profile.loading || loading()}
            >
              Update profile
            </button>
          </form>
          <p>{msg()}</p>
          <button
            type="button"
            class="w-max py-1 px-2 border border-black rounded my-6
            bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
            onClick={() => supabase.auth.signOut()}
            disabled={profile.loading || loading()}
          >
            Sign Out
          </button>
        </Match>
      </Switch>
    </main>
  );
};

export default Profile;
