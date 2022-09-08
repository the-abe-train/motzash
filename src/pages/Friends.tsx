import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Show,
  Switch,
  useContext,
} from "solid-js";
import FriendMap from "../components/maps/FriendMap";
import Status from "../components/Status";

import UpdateStatusForm from "../components/forms/UpdateStatusForm";
import AddFriendForm from "../components/forms/AddFriendForm";
import { loadStatuses } from "../util/queries";
import { createStore } from "solid-js/store";
import { AuthContext } from "../context/auth";

const Friends: Component = () => {
  const session = useContext(AuthContext);
  const [showScreen, setShowScreen] = createSignal<ScreenName>("Map");

  // Get data from Supabase
  const [loadedStatuses, { refetch }] = createResource(loadStatuses);
  const [statuses, setStatuses] = createStore<FriendStatus[]>([]);
  createEffect(() => {
    if (loadedStatuses.state === "ready") {
      const returnedValue = loadedStatuses();
      if (returnedValue) {
        setStatuses(returnedValue);
      }
    }
  });

  const [focus, setFocus] = createSignal<FriendStatus | MyStatus | null>(null);
  const [friendFilter, setFriendFilter] = createSignal("");

  const filteredFriends = () => {
    const friends = statuses.filter(
      (status) => status.user_id !== session()?.user.id
    );
    const ff = friendFilter().toLowerCase();
    const regex = new RegExp(ff, "i");
    return friends.filter((name) => name.profiles.username.match(regex)) || [];
  };

  const myStatus = () =>
    statuses.find((status) => status.user_id === session()?.user.id) || null;

  const addStatusButton = (
    <button
      class="w-full h-20 rounded
  bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
      onClick={() => setShowScreen("UpdateStatus")}
      disabled={showScreen() === "UpdateStatus"}
    >
      Add status
    </button>
  );

  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside
        class="col-span-5 lg:col-span-5 xl:col-span-4 
          border-r flex flex-col space-y-5 p-4 "
      >
        <h2>Your Status</h2>
        <Show when={myStatus()} fallback={addStatusButton} keyed>
          {(status) => {
            return (
              <>
                <Status status={status} focus={focus} setFocus={setFocus} />
                <button
                  class="rounded w-fit p-2
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                  onClick={() => setShowScreen("UpdateStatus")}
                >
                  Edit status
                </button>
              </>
            );
          }}
        </Show>
        <h2>Your Friends</h2>
        <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-scroll">
          <form
            class="flex w-full space-x-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              class="mx-2 border px-2 w-1/2"
              placeholder="Filter by name"
              value={friendFilter()}
              onChange={(e) => setFriendFilter(e.currentTarget.value)}
            />
            <button
              type="submit"
              class="py-1 px-2 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
            >
              Filter
            </button>
            <button
              type="reset"
              class="py-1 px-2 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
              onClick={() => setFriendFilter("")}
            >
              Clear
            </button>
          </form>
          <For
            each={filteredFriends()}
            fallback={<p>No friend statuses to show.</p>}
          >
            {(status) => {
              return (
                <Status status={status} focus={focus} setFocus={setFocus} />
              );
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
          <Show when={!loadedStatuses.loading} fallback={<p>Loading map...</p>}>
            <FriendMap
              friends={filteredFriends()}
              user={myStatus()}
              focus={focus()}
              setFocus={setFocus}
            />
          </Show>
        </Match>
        <Match when={showScreen() === "UpdateStatus"}>
          <UpdateStatusForm
            myStatus={myStatus()}
            setShowScreen={setShowScreen}
            refetch={refetch}
          />
        </Match>
        <Match when={showScreen() === "AddFriend"}>
          <AddFriendForm setShowScreen={setShowScreen} refetch={refetch} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;
