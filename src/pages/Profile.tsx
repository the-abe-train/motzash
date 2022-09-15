import { useNavigate } from "@solidjs/router";
import {
  Component,
  Switch,
  Match,
  useContext,
  createSignal,
  createResource,
  createEffect,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth2";
import { loadProfile } from "../util/queries";
import { supabase } from "../util/supabase";

const Profile: Component = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  const user_id = user()?.id;
  const [msg, setMsg] = createSignal("");
  const [newProfile, setNewProfile] = createStore<Profile>({
    id: "",
    updated_at: "",
    username: "",
  });

  const [profile, { refetch }] = createResource(user_id, loadProfile);

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
        .match({ id: user_id });

      if (error) {
        throw error;
      }
      setMsg("Profile updated!");
    } catch (error: any) {
      alert(error.message || "Database error.");
    }
    setLoading(false);
  };

  async function deleteUser() {
    await supabase.auth.signOut();
    const res = await fetch("/api/deleteUser", {
      method: "POST",
      body: JSON.stringify({
        user_id: user()?.id,
      }),
    });
    if (res.ok) {
      navigate("/", { replace: true });
    } else {
      setMsg("Something went wrong. Please contact Support.");
    }
  }

  return (
    <main class="flex-grow p-4 space-y-4">
      <Show when={profile.state === "ready"} fallback={<p>Loading...</p>}>
        <div>Email: {profile()?.email || "no email set"}</div>
        <form onSubmit={updateProfile} class="flex flex-col space-y-3">
          <div>
            <label for="username">Name</label>
            <input
              id="username"
              class="px-2 py-1 flex-grow border border-black"
              type="text"
              value={newProfile.username || ""}
              onChange={(e) => setNewProfile("username", e.currentTarget.value)}
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
            bg-ghost drop-shadow-small hover:drop-shadow-none disabled:drop-shadow-none transition-all"
          onClick={() => supabase.auth.signOut()}
          disabled={profile.loading || loading()}
        >
          Sign Out
        </button>
        <button
          type="button"
          class="w-max py-1 px-2 border rounded my-6
            bg-yellow2 text-coral border-coral drop-shadow-small 
            hover:drop-shadow-none disabled:drop-shadow-none transition-all"
          onClick={deleteUser}
          disabled={profile.loading || loading()}
        >
          Delete account
        </button>
      </Show>
    </main>
  );
};

export default Profile;
