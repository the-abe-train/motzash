import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Setter,
  Switch,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  createRequest,
  deleteRequest,
  findFriendship,
  getUser,
  loadRequestsToMe,
} from "../../util/queries";
import { supabase } from "../../util/supabase";

type Props = {
  refetchFriendStatuses: () => any | Promise<any> | undefined | null;
  setShowScreen: Setter<ScreenName>;
};

const AddFriendForm: Component<Props> = (props) => {
  const [data, { refetch }] = createResource(loadRequestsToMe);
  const [friendRequests, setFriendRequests] = createStore<IFriendRequest[]>([]);
  const [friendEmail, setFriendEmail] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [loading2, setLoading2] = createSignal(false);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = data() as IFriendRequest[];
    if (returnedValue) setFriendRequests(returnedValue);
  });

  // TODO Players should be able to share "friend request" links on social media
  // and maybe QR codes
  const sendRequest = async (e: Event) => {
    // Manage form
    e.preventDefault();
    setLoading(true);

    // User entered their own email address
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    if (friendEmail() === user.data.user?.email) {
      setMsg("You cannot send a request to yourself.");
      setLoading(false);
      return;
    }

    // User doesn't have a username
    const userData = await getUser({ id: user_id });
    if (!userData?.username) {
      setMsg(
        `You need a username to send a friend request.
        You can set your username in the Profile page.`
      );
      setLoading(false);
      return;
    }

    // Friend is not an existing user
    const friendData = await getUser({ email: friendEmail() });
    if (!friendData) {
      const userProfile = await getUser({ id: user_id });
      const res = await fetch("/api/inviteByEmail", {
        method: "POST",
        body: JSON.stringify({
          friendEmail: friendEmail(),
          username: userProfile?.username,
        }),
      });
      if (res.ok) {
        await createRequest({ email: friendEmail() });
        setMsg("New user invited to Motzash!");
      } else {
        setMsg("Something went wrong. Please contact Support.");
      }
      setLoading(false);
      return;
    }

    // Friendship request already exists
    const { id: friend_id } = friendData;
    const existingReq = await findFriendship(user_id, friend_id);
    if (existingReq) {
      if (existingReq.accepted) {
        setMsg("Friendship already exists.");
      } else {
        setMsg("Friend request already exists.");
      }
      setLoading(false);
      return;
    }

    // Send friend request to existing user
    const requestCreated = await createRequest({ id: friend_id });
    if (!requestCreated) {
      setMsg("Error creating friend request. Please contact support");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/inviteByEmail", {
      method: "POST",
      body: JSON.stringify({
        friendEmail: friendEmail(),
        username: userData?.username,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setMsg("Friend request sent!");
    }
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
    props.refetchFriendStatuses();
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
  }

  const [deleteEmail, setDeleteEmail] = createSignal("");
  const [msg2, setMsg2] = createSignal("");
  const [loading3, setLoading3] = createSignal(false);
  async function removeFriendship(e: Event) {
    e.preventDefault();
    setLoading3(true);
    const requestDeleted = await deleteRequest({ email: deleteEmail() });
    if (requestDeleted) {
      setMsg2("Friendship deleted.");
    } else {
      setMsg2("An error occurred. Please contact support.");
    }
    setLoading3(false);
    return;
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
          <label for="text">Enter your friend's email</label>
          <input
            type="email"
            name="text"
            class="border w-1/2 px-2"
            value={friendEmail()}
            onChange={(e) => setFriendEmail(e.currentTarget.value)}
            required
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
      <div class="my-8">
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
              {(req, idx) => <FriendRequest {...req} idx={idx()} />}
            </For>
          </Match>
        </Switch>
      </div>
      <form
        action=""
        class="flex space-x-4 items-center"
        onSubmit={removeFriendship}
      >
        <label for="remove">Remove a friendship</label>
        <input
          type="email"
          name="text"
          class="border w-1/2 px-2"
          value={deleteEmail()}
          onChange={(e) => setDeleteEmail(e.currentTarget.value)}
          required
          placeholder="Friend's email"
        />
        <button
          type="submit"
          class="w-fit px-2 py-1 border rounded bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          disabled={loading3()}
        >
          Remove
        </button>
      </form>
      <p>{msg2}</p>
    </div>
  );
};

export default AddFriendForm;
