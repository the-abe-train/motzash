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
import {
  createRequest,
  findExistingReq,
  getUserIdByUsername,
  loadRequestsToMe,
} from "../../util/queries";
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
  const [friendUsername, setFriendUsername] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [loading2, setLoading2] = createSignal(false);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = data();
    // @ts-ignore
    if (returnedValue) setFriendRequests(returnedValue);
  });

  const sendRequest = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    console.log("Sending request");
    const friendIdData = await getUserIdByUsername(friendUsername());
    if (!friendIdData) {
      setMsg("No user with that username found.");
      setLoading(false);
      return;
    }
    const { id: friend_id } = friendIdData;
    if (friend_id === user_id) {
      setMsg("You cannot send a request to yourself.");
      setLoading(false);
      return;
    }
    const existingReq = await findExistingReq(user_id, friend_id);
    if (existingReq) {
      if (existingReq.accepted) {
        setMsg("Friendship already exists.");
      } else {
        setMsg("Friend request already exists.");
      }
      setLoading(false);
      return;
    }
    const newRequest = await createRequest(friend_id);
    console.log(newRequest);
    setMsg("Friend request sent!");
    setLoading(false);
    return;
  };

  async function acceptRequest(idx: number, requester_id: string) {
    setLoading2(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    console.log("user_id", user_id);
    console.log("requester_id", requester_id);
    const { data, error } = await supabase
      .from("friendships")
      .update({ accepted: true })
      .match({ friend_id: user_id, requester_id });
    if (error) {
      console.error(error);
      setLoading2(false);
      return;
    }
    setFriendRequests(idx, "accepted", true);
    console.log("Friend reqs", friendRequests);
    setLoading2(false);
  }

  async function rejectRequest(idx: number, requester_id: string) {
    setLoading2(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const { data, error } = await supabase
      .from("friendships")
      .delete()
      .match({ friend_id: user_id, requester_id });
    if (error) {
      console.error(error);
      setLoading2(false);
      return;
    }
    setLoading2(false);
    refetch();
    // setFriendRequests(prev => {
    //   prev.splice(idx, 1)
    //   return prev
    // });
    // console.log("Friend reqs", friendRequests);
    // setLoading(false);
  }

  // TODO Wire up remove friendship form
  function removeFriendship(e: Event) {
    e.preventDefault();
    console.log("Friendship deleted");
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
                disabled={loading2()}
                class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                onClick={() => acceptRequest(props.idx, props.requester.id)}
              >
                Accept
              </button>
              <button
                disabled={loading2()}
                class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
                onClick={() => rejectRequest(props.idx, props.requester.id)}
              >
                Delete
              </button>
            </div>
          </Match>
        </Switch>
      </form>
    );
  };

  return (
    <div class="col-span-7">
      <form onSubmit={sendRequest} class=" flex flex-col space-y-4 relative">
        <button
          class="absolute top-2 right-2
      w-fit px-2  border rounded
      bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          onClick={() => props.setShowScreen(() => "Map")}
          type="button"
        >
          X
        </button>
        <div class="flex flex-col space-y-2">
          <label for="text">Enter your friend's username</label>
          <input
            type="text"
            name="text"
            class="border w-1/2 px-2"
            value={friendUsername()}
            onChange={(e) => setFriendUsername(e.currentTarget.value)}
            minLength={3}
          />
        </div>
        <button
          type="submit"
          disabled={loading()}
          class="w-fit p-2  border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
        >
          Send request
        </button>
      </form>
      <p>{msg}</p>
      <div>
        <h2 class="text-lg mt-24">Friend requests</h2>
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
      <form
        action=""
        class="flex space-x-4 items-center absolute bottom-4"
        onSubmit={removeFriendship}
      >
        <label for="remove">Remove a friendship</label>
        <input
          type="text"
          name="remove"
          class="border w-1/2 px-2"
          placeholder="Friend's username"
        />
        <button
          type="submit"
          class="w-fit px-2 py-1 border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
        >
          Remove
        </button>
      </form>
    </div>
  );
};

export default AddFriendForm;
