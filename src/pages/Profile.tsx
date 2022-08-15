import {
  Component,
  createResource,
  Switch,
  Match,
  useContext,
  createSignal,
  createEffect,
} from "solid-js";
import { AuthContext } from "../context/auth";
import { supabase } from "../util/supabase";

type Profile = {
  id: string;
  updated_at: string;
  username: string;
  website: string;
};

const loadProfile = async () => {
  const user = supabase.auth.user();

  let { data, error, status } = await supabase
    .from<Profile>("profiles")
    .select(`username, website`)
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

  return data;
};

const Profile: Component = () => {
  const [data, { mutate, refetch }] = createResource(loadProfile);

  const [loading, setLoading] = createSignal(true);
  const [username, setUsername] = createSignal<string | null>(null);
  const [website, setWebsite] = createSignal<string | null>(null);

  createEffect(() => {
    // props.session
    console.log(data());
  });

  const updateProfile = async (e: Event) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id || "",
        username: username(),
        website: website(),
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

  const session = useContext(AuthContext);

  return (
    <main class="flex-grow p-4">
      <Switch>
        <Match when={data.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={!data.loading}>
          <form onSubmit={updateProfile} class="flex flex-col space-y-3">
            <div>Email: {session()?.user?.email || "no email set"}</div>
            <div class="space-x-2">
              <label for="username">Name</label>
              <input
                id="username"
                class="border p-1"
                type="text"
                value={data()?.username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div class="space-x-2">
              <label for="website">Website</label>
              <input
                id="website"
                class="border p-1"
                type="url"
                value={data()?.website}
                onChange={(e) => setWebsite(e.currentTarget.value)}
              />
            </div>
            <div>
              <button
                type="submit"
                class=" rounded p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                // disabled={loading()}
              >
                Update profile
              </button>
            </div>
          </form>
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
