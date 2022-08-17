import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  onCleanup,
  onMount,
  Show,
  Switch,
} from "solid-js";
import statuses from "../data/statuses.json";
import FriendMap from "../components/FriendMap";
import Status from "../components/Status";
import { supabase } from "../util/supabase";
import { createStore } from "solid-js/store";
import { RealtimeSubscription } from "@supabase/supabase-js";
import { getGeoNameId, getLocation } from "../util/location";
import { loadMyStatus } from "../util/queries";

const loadFriendStatuses = async () => {
  console.log("Loading data from database");
  const user = supabase.auth.user();
  const { data, error } = await supabase
    .from<ProfileStatus>("statuses")
    .select("*, profiles (username)");
  if (error) {
    if (error.code === "PGRST116") return null;
    console.error(error);
    return null;
  }
  console.log("new data", data);
  return data;
};

const Friends: Component = () => {
  const [showForm, setShowForm] = createSignal(true);
  const [newStatus, setNewStatus] = createStore<Status>({
    text: "",
    tags: [""],
    lat: null,
    lng: null,
    user_id: supabase.auth.user()?.id || "",
    city: "",
  });

  // Get data from Supabase
  const [myStatus, { refetch }] = createResource(loadMyStatus);
  const [friendStatuses] = createResource(loadFriendStatuses);

  // Start off with defaults
  createEffect(() => {
    const returnedValue = myStatus();
    if (returnedValue)
      setNewStatus(() => {
        const { id, created_at, profiles, ...newStatus } = returnedValue;
        return newStatus;
      });
  });

  // Subscription
  let subscription: RealtimeSubscription | null;
  onMount(() => {
    subscription = supabase
      .from<Status>("statuses")
      .on("*", () => refetch())
      .subscribe();
  });
  onCleanup(() => {
    console.log("clean up");
    subscription?.unsubscribe();
  });

  const toggleShowForm = () => setShowForm((prev) => !prev);

  // This works, do not change!
  const upsertStatus = async (e: Event) => {
    e.preventDefault();
    await supabase.from<Status>("statuses").upsert(newStatus, {
      onConflict: "user_id",
    });
  };

  const deleteStatus = async (e: Event) => {
    e.preventDefault();
    console.log("Deleting status");
    const user = supabase.auth.user();
    console.log(user?.id);
    const { count, error } = await supabase
      .from<Status>("statuses")
      .delete()
      .eq("user_id", user?.id || "");
    console.log(count, "rows deleted.");
    if (error) console.error(error);
  };

  const selectTags = (e: Event & { currentTarget: HTMLSelectElement }) => {
    const options = e.currentTarget.selectedOptions;
    const numTags = options.length;
    const values: string[] = [];
    for (let i = 0; i < numTags; i++) {
      const option = options.item(i);
      if (option?.value) values.push(option?.value);
    }
    setNewStatus("tags", values);
  };

  async function updateLocation() {
    const { lat, lng } = await getLocation();
    const city = await getGeoNameId(lat, lng);
    setNewStatus("lat", lat);
    setNewStatus("lng", lng);
    setNewStatus("city", city);
  }

  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside
        class="col-span-5 lg:col-span-5 xl:col-span-4 
          border-r flex flex-col space-y-5 p-4 "
      >
        <h2>Your Status</h2>
        <Switch fallback={<button>Add status</button>}>
          <Match when={!myStatus()}>
            <button
              class="w-full h-20 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
              onClick={toggleShowForm}
              disabled={showForm()}
            >
              Add status
            </button>
          </Match>
          <Match when={!myStatus.loading}>
            {/* @ts-ignore */}
            <Status status={myStatus()} />
            <Show when={!showForm()}>
              <button
                class="rounded w-fit p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                onClick={toggleShowForm}
              >
                Edit status
              </button>
            </Show>
          </Match>
          <Match when={myStatus.loading}>
            <p>Loading...</p>
          </Match>
        </Switch>
        <h2>Your Friends</h2>
        <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-scroll">
          <For each={friendStatuses()}>
            {(status) => {
              return <Status status={status} />;
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
                class="border w-1/2 px-2"
                value={newStatus.text}
                onChange={(e) => setNewStatus("text", e.currentTarget.value)}
              />
            </div>
            <div class="flex flex-col space-y-2">
              <label for="cars">Choose up to 4 tags:</label>
              <select
                multiple
                name="cars"
                class="w-96 border"
                onChange={selectTags}
              >
                <option value="board games">Board games</option>
                <option value="basketball">Basketball</option>
                <option value="Shaleshudes">Shaleshudes</option>
                <option value="chulent">Chulent</option>
              </select>
            </div>
            <div class="flex space-x-4">
              <button
                class="w-fit p-2  border rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                onClick={updateLocation}
                type="button"
              >
                Get location
              </button>
              <input
                class="border px-2"
                type="text"
                value={newStatus.city}
                onChange={(e) => setNewStatus("city", e.currentTarget.value)}
              />
            </div>
            <div class="flex space-x-4">
              <button
                type="submit"
                class="w-fit p-2  border rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
              >
                Update status
              </button>
              <button
                class="w-fit p-2  border rounded
               hover:bg-slate-300 active:bg-slate-400"
                onClick={deleteStatus}
              >
                Delete status
              </button>
            </div>
          </form>
        </Match>
        <Match when={!showForm()}>
          <FriendMap statuses={friendStatuses() || []} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;

// for (let index = 0; index < array.length; index++) {
//   const element = array[index];

// }
