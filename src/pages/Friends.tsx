import {
  Component,
  createResource,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import FriendMap from "../components/FriendMap";
import Status from "../components/Status";

import { loadFriendStatuses, loadMyStatus } from "../util/queries";
import UpdateStatusForm from "../components/forms/UpdateStatusForm";
import AddFriendForm from "../components/forms/AddFriendForm";

const Friends: Component = () => {
  const [showScreen, setShowScreen] = createSignal<ScreenName>("Map");

  // Get data from Supabase
  const [myStatus, { refetch: myStatusRefetch }] = createResource(loadMyStatus);
  const [friendStatuses] = createResource(loadFriendStatuses);

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
        <button
          class="w-full h-20 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          onClick={() => setShowScreen("AddFriend")}
        >
          Add friend
        </button>
      </aside>
      <Switch>
        <Match when={showScreen() === "Map"}>
          {/* @ts-ignore */}
          <FriendMap statuses={friendStatuses() || []} />
        </Match>
        <Match when={showScreen() === "UpdateStatus"}>
          <UpdateStatusForm
            myStatus={myStatus}
            setShowScreen={setShowScreen}
            myStatusRefetch={myStatusRefetch}
          />
        </Match>
        <Match when={showScreen() === "AddFriend"}>
          <AddFriendForm myStatus={myStatus} setShowScreen={setShowScreen} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;
