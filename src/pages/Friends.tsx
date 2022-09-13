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
  const user_id = user()?.id;
  const [showScreen, setShowScreen] = createSignal<ScreenName>("Map");

  // Get data from Supabase
  const [loadedStatuses, { refetch: refetchStatuses }] =
    createResource(loadStatuses);
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
    const friends = statuses.filter((status) => status.user_id !== user_id);
    const ff = friendFilter().toLowerCase();
    const regex = new RegExp(ff, "i");
    return friends.filter((name) => name.profiles.username.match(regex)) || [];
  };

  const myStatus = () =>
    statuses.find((status) => status.user_id === user_id) || null;

  const addStatusButton = (
    <button
      class="p-2 h-20 w-full border border-black rounded drop-shadow-small 
    mx-auto text-xl bg-blue hover:drop-shadow-none transition-all"
      onClick={() => setShowScreen("UpdateStatus")}
      disabled={showScreen() === "UpdateStatus"}
    >
      Add status
    </button>
  );

  // TODO RESPONSIVE HIDE
  return (
    <>
      <Show when={showScreen() === "Map" || window.innerWidth > 768}>
        <div class="col-span-6 lg:col-span-4 space-y-5 py-2">
          <h1 class="text-2xl font-header">Your Status</h1>
          <Show when={myStatus()} fallback={addStatusButton} keyed>
            {(status) => {
              return (
                <>
                  <Status status={status} focus={focus} setFocus={setFocus} />
                  <button
                    class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
                         bg-blue hover:drop-shadow-none transition-all"
                    onClick={() => setShowScreen("UpdateStatus")}
                  >
                    Edit status
                  </button>
                </>
              );
            }}
          </Show>
          <h1 class="text-2xl font-header">Your Friends</h1>
          <div class="flex flex-col space-y-3 max-h-[60vh]">
            <form class="flex space-x-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="filter"
                class="border border-black px-2 w-full"
                placeholder="Filter by name"
                value={friendFilter()}
                onChange={(e) => setFriendFilter(e.currentTarget.value)}
              />
              <button
                type="submit"
                class="px-2 w-fit border border-black rounded drop-shadow-small 
              bg-blue hover:drop-shadow-none transition-all"
              >
                Filter
              </button>
              <button
                type="reset"
                class="px-2 py-1 w-fit text-coral border border-coral rounded drop-shadow-small 
              bg-yellow2 hover:drop-shadow-none transition-all"
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
            class="p-2 h-20 w-full border border-black rounded drop-shadow-small 
          mx-auto text-xl bg-blue hover:drop-shadow-none transition-all"
            onClick={() => setShowScreen("AddFriend")}
          >
            Add friend
          </button>
        </div>
      </Show>
      <Switch>
        <Match when={showScreen() === "Map"}>
          <Show
            when={loadedStatuses.state === "ready"}
            fallback={<p>Loading map...</p>}
          >
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
            refetch={refetchStatuses}
          />
        </Match>
        <Match when={showScreen() === "AddFriend"}>
          <AddFriendForm
            setShowScreen={setShowScreen}
            refetchStatuses={refetchStatuses}
          />
        </Match>
      </Switch>
    </>
  );
};

export default Friends;
