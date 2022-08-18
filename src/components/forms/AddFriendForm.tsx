import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Resource,
  Setter,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Database } from "../../lib/database.types";
import { loadRequestsToMe } from "../../util/queries";
import { supabase } from "../../util/supabase";

type Props = {
  myStatus: Resource<any>;
  setShowScreen: Setter<ScreenName>;
};

type D = Database["public"]["Tables"]["friendships"]["Row"];

interface IFriendRequest extends D {
  friend: Database["public"]["Tables"]["profiles"]["Row"];
  requester: Database["public"]["Tables"]["profiles"]["Row"];
}

const AddFriendForm: Component<Props> = (props) => {
  const [data, { refetch, mutate }] = createResource(loadRequestsToMe);
  const [friendRequests, setFriendRequests] = createStore<IFriendRequest[]>([]);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = data();
    // @ts-ignore
    if (returnedValue) setFriendRequests(returnedValue);
  });

  const [friendHandle, setFriendHandle] = createSignal("");

  const sendRequest = (e: Event) => {
    e.preventDefault();
    console.log("Request sent");
    mutate((reqs) => {
      if (reqs) reqs[0] = { ...reqs[0], accepted: true };
      return reqs;
    });
  };

  async function acceptRequest(idx: number) {
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const { data, error } = await supabase
      .from("friendships")
      .update({ accepted: true })
      .match({ friend_id: user_id });
    if (error) {
      console.error(error);
      return;
    }
    setFriendRequests(idx, "accepted", true);
    console.log("Friend reqs", friendRequests);
  }

  function rejectRequest() {
    console.log("Request rejected");
  }

  const FriendRequest: Component<IFriendRequest & { idx: number }> = (
    props
  ) => {
    return (
      <form
        action=""
        class="flex justify-between items-center bg-slate-100 p-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <p class="">{props.requester.username}</p>
        <Switch>
          <Match when={props.accepted}>
            <p>Accepted!</p>
          </Match>
          <Match when={!props.accepted}>
            <div class="flex space-x-4">
              <button
                class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                onClick={() => acceptRequest(props.idx)}
              >
                Accept
              </button>
              <button
                class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
                onClick={rejectRequest}
              >
                Reject
              </button>
            </div>
          </Match>
        </Switch>
      </form>
    );
  };

  return (
    <div class="col-span-7">
      <form
        onSubmit={sendRequest}
        class=" flex flex-col space-y-4 p-4 relative"
      >
        <button
          class="absolute top-2 right-2
      w-fit px-2  border rounded
      bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          onClick={() => props.setShowScreen(() => "Map")}
        >
          X
        </button>
        <div class="flex flex-col space-y-2">
          <label for="text">Enter your friend's handle</label>
          <input
            type="text"
            name="text"
            class="border w-1/2 px-2"
            value={friendHandle()}
            onChange={(e) => setFriendHandle(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        >
          Send request
        </button>
      </form>
      <h2 class="text-lg">Friend requests</h2>
      <Switch fallback={<p>Loading...</p>}>
        <Match when={!friendRequests}>
          <p>Loading...</p>
        </Match>
        <Match when={friendRequests.length === 0}>
          <p>No friend requests at the moment!</p>
        </Match>
        <Match when={friendRequests.length > 0}>
          <For each={friendRequests}>
            {/* @ts-ignore */}
            {(req, idx) => <FriendRequest {...req} idx={idx()} />}
          </For>
        </Match>
      </Switch>
    </div>
  );
};

export default AddFriendForm;
