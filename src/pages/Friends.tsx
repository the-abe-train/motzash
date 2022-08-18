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
import FriendMap from "../components/FriendMap";
import Status from "../components/Status";
import { supabase } from "../util/supabase";
import { createStore } from "solid-js/store";

import { loadFriendStatuses, loadMyStatus } from "../util/queries";
import UpdateStatusForm from "../components/forms/UpdateStatusForm";

const Friends: Component = () => {
  const [showScreen, setShowScreen] = createSignal<ScreenName>("Map");

  // Get data from Supabase
  const [myStatus, { refetch }] = createResource(loadMyStatus);
  const [friendStatuses] = createResource(loadFriendStatuses);

  // Subscription
  onMount(async () => {
    console.log("Mounting Friends");
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const filter = `user_id=eq.${user_id}`;
    supabase
      .channel(`public:statuses:${filter}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "statuses", filter },
        (payload: any) => {
          console.log(payload);
          refetch();
        }
      )
      .subscribe();
  });
  onCleanup(() => {
    // supabase.removeAllChannels();
    console.log("Cleanup Friends");
  });

  // This works, do not change!

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
              onClick={() => setShowScreen("UpdateStatus")}
              disabled={showScreen() === "UpdateStatus"}
            >
              Add status
            </button>
          </Match>
          <Match when={!myStatus.loading}>
            {/* @ts-ignore */}
            <Status status={myStatus()} />

            <button
              class="rounded w-fit p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
              onClick={() => setShowScreen("UpdateStatus")}
            >
              Edit status
            </button>
          </Match>
          <Match when={myStatus.loading}>
            <p>Loading...</p>
          </Match>
        </Switch>
        <h2>Your Friends</h2>
        <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-scroll">
          <For each={friendStatuses()}>
            {(status) => {
              // It's very silly that Supabase couldn't figure out the column
              // type of the joined table
              // @ts-ignore
              return <Status status={status} />;
            }}
          </For>
        </div>
      </aside>
      <Switch>
        <Match when={showScreen() === "Map"}>
          {/* @ts-ignore */}
          <FriendMap statuses={friendStatuses() || []} />
        </Match>
        <Match when={showScreen() === "UpdateStatus"}>
          <UpdateStatusForm myStatus={myStatus} setShowScreen={setShowScreen} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;

// for (let index = 0; index < array.length; index++) {
//   const element = array[index];

// }
