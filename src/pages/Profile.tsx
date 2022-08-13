import { Session } from "@supabase/supabase-js";
import { createSignal, createEffect, Component } from "solid-js";
import { supabase } from "../util/supabase";

type Props = {
  session: Session | null;
};

const Profile: Component<Props> = ({ session }) => {
  const [loading, setLoading] = createSignal(true);
  const [username, setUsername] = createSignal<string | null>(null);
  const [website, setWebsite] = createSignal<string | null>(null);
  const [avatar_url, setAvatarUrl] = createSignal<string | null>(null);

  createEffect(() => {
    // props.session
    getProfile();
  });

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user?.id || "")
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message || "Database error.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: Event) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id || "",
        username: username(),
        website: website(),
        avatar_url: avatar_url(),
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message || "Database error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main class="flex-grow p-4">
      {loading() ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} class="form-widget">
          <div>Email: {session?.user?.email || "no email set"}</div>
          <div>
            <label for="username">Name</label>
            <input
              id="username"
              type="text"
              value={username() || ""}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          <div>
            <label for="website">Website</label>
            <input
              id="website"
              type="url"
              value={website() || ""}
              onChange={(e) => setWebsite(e.currentTarget.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              class="button block primary"
              disabled={loading()}
            >
              Update profile
            </button>
          </div>
        </form>
      )}
      <button
        type="button"
        class="button block"
        onClick={() => supabase.auth.signOut()}
      >
        Sign Out
      </button>
    </main>
  );
};

export default Profile;
