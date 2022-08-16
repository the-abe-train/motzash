import { Component, createSignal, For, Match, Switch } from "solid-js";
import statuses from "../data/statuses.json";
import FriendMap from "../components/FriendMap";
import Status from "../components/Status";
import { supabase } from "../util/supabase";
import { createStore } from "solid-js/store";
import { createSync } from "../util/createSync";

const loadMyStatus = async () => {
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from<Status>("statuses")
    .select("*")
    .eq("user_id", user?.id || "")
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  return data;
};

const Friends: Component = () => {
  const [showForm, setShowForm] = createSignal(true);
  const [myStatus, setMyStatus] = createStore<Status>({
    text: "",
    tags: [""],
    lat: null,
    lng: null,
  });

  const upsertStatus = async (e: Event) => {
    e.preventDefault();
    const user = supabase.auth.user();
    console.log("User", user);
    const updates = {
      ...myStatus,
      user_id: user?.id,
    };
    console.log(updates);
    // console.log(myStatus);
    let { error } = await supabase.from<Status>("statuses").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
      onConflict: "user_id",
    });
    if (error) {
      // alert(error.message || "Database error.");
      console.error(error);
    }
  };

  const sync = createSync(setMyStatus, loadMyStatus);
  const toggleShowForm = () => setShowForm((prev) => !prev);

  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside
        class="col-span-5 lg:col-span-5 xl:col-span-4 
          border-r flex flex-col space-y-5 p-4 "
      >
        <h2>Your Status</h2>
        <button
          class="w-full h-20 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          onClick={toggleShowForm}
          disabled={showForm()}
        >
          Add status
        </button>
        <h2>Your Friends</h2>
        <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-scroll">
          <For each={statuses}>
            {(status) => {
              return <Status {...status} />;
            }}
          </For>
        </div>
      </aside>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={showForm()}>
          <form
            onSubmit={upsertStatus}
            class="col-span-7 flex flex-col space-y-4 p-4 relative"
          >
            <button
              class="absolute top-2 right-2
                w-fit px-2  border rounded
                bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
              onClick={toggleShowForm}
            >
              X
            </button>
            <div class="flex flex-col space-y-2">
              <label for="text">What are you up to on Shabbos?</label>
              <input
                type="text"
                name="text"
                class="border w-1/2"
                value={myStatus.text}
                onChange={(e) =>
                  setMyStatus((prev) => ({
                    ...prev,
                    text: e.currentTarget.value,
                  }))
                }
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label for="cars">Choose up to 4 tags:</label>
              <select multiple name="cars" class="w-96 border">
                <option value="board games">Board games</option>
                <option value="basketball">Basketball</option>
                <option value="Shaleshudes">Shaleshudes</option>
                <option value="chulent">Chulent</option>
              </select>
            </div>
            <button
              type="submit"
              class="w-fit p-2  border rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
              // onClick={toggleShowForm}
            >
              Update status
            </button>
          </form>
        </Match>
        <Match when={!showForm()}>
          <FriendMap statuses={statuses} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;
