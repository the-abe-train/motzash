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
import { AuthContext } from "../context/auth2";

const Friends: Component = () => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const [showScreen, setShowScreen] = createSignal<ScreenName>("Map");

  // Get data from Supabase
  const [loadedStatuses, { refetch }] = createResource(loadStatuses);
  const [statuses, setStatuses] = createStore({
    statuses: [] as FriendStatus[],
    get myStatus() {
      return this.statuses.find((status) => status.user_id === user_id) || null;
    },
    get filteredStatuses() {
      const friends = this.statuses.filter(
        (status) => status.user_id !== user_id
      );
      const ff = friendFilter().toLowerCase();
      const regex = new RegExp(ff, "i");
      return (
        friends.filter((name) => name.profiles.username.match(regex)) || []
      );
    },
  });
  createEffect(() => {
    if (loadedStatuses.state === "ready") {
      const returnedValue = loadedStatuses();
      if (returnedValue) {
        setStatuses("statuses", returnedValue);
      }
    }
  });

  const [focus, setFocus] = createSignal<FriendStatus | MyStatus | null>(null);
  const [friendFilter, setFriendFilter] = createSignal("");

  const addStatusButton = (
    <button
      class="p-2 h-20 w-full border border-black rounded drop-shadow-small 
    mx-auto text-xl bg-blue hover:drop-shadow-none transition-all
    cursor-pointer"
      onClick={() => setShowScreen("UpdateStatus")}
      disabled={showScreen() === "UpdateStatus"}
      data-cy="add-status-button"
    >
      Add status
    </button>
  );

  return (
    <>
      <Show when={showScreen() === "Map" || window.innerWidth > 768}>
        <div class="col-span-6 lg:col-span-4 space-y-10 py-2">
          <div class="space-y-4">
            <h1 class="text-2xl font-header">Your Status</h1>
            <Show when={statuses.myStatus} fallback={addStatusButton} keyed>
              {(status) => {
                return (
                  <>
                    <Status status={status} focus={focus} setFocus={setFocus} />
                    <button
                      class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
                         bg-blue hover:drop-shadow-none transition-all"
                      onClick={() => setShowScreen("UpdateStatus")}
                      data-cy="add-status-button"
                    >
                      Edit status
                    </button>
                  </>
                );
              }}
            </Show>
          </div>
          <div class="space-y-4">
            <h1 class="text-2xl font-header">Your Friends</h1>
            <div class="flex flex-col space-y-3 max-h-[60vh]">
              <form class="flex space-x-4" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  name="filter"
                  class="border border-black px-2 w-full"
                  placeholder="Filter by name"
                  value={friendFilter()}
                  maxLength={50}
                  onChange={(e) => setFriendFilter(e.currentTarget.value)}
                />
                <button
                  type="submit"
                  class="px-2 w-fit border border-black rounded drop-shadow-small 
              bg-ghost hover:drop-shadow-none transition-all"
                >
                  Filter
                </button>
                <button
                  type="reset"
                  class="px-2 py-1 w-fit text-coral2 border border-coral2 rounded drop-shadow-small 
              bg-yellow2 hover:drop-shadow-none transition-all"
                  onClick={() => setFriendFilter("")}
                >
                  Clear
                </button>
              </form>
              <For
                each={statuses.filteredStatuses}
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
              class="p-2 h-20 w-full border border-black rounded drop-shadow-small 
          mx-auto text-xl bg-blue hover:drop-shadow-none transition-all"
              onClick={() => setShowScreen("AddFriend")}
            >
              Add friend
            </button>
          </div>
        </div>
      </Show>
      <Switch>
        <Match when={showScreen() === "Map"}>
          <Show
            when={loadedStatuses.state === "ready"}
            fallback={<p>Loading map...</p>}
          >
            <FriendMap
              friends={statuses.filteredStatuses}
              user={statuses.myStatus}
              focus={focus()}
              setFocus={setFocus}
            />
          </Show>
        </Match>
        <Match when={showScreen() === "UpdateStatus"}>
          <UpdateStatusForm
            myStatus={statuses.myStatus}
            setShowScreen={setShowScreen}
            refetch={refetch}
          />
        </Match>
        <Match when={showScreen() === "AddFriend"}>
          <AddFriendForm
            setShowScreen={setShowScreen}
            refetchStatuses={refetch}
          />
        </Match>
      </Switch>
    </>
  );
};

export default Friends;
