import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Match,
  Setter,
  Show,
  Switch,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth2";
import {
  createRequest,
  deleteRequest,
  findFriendship,
  getUserProfile,
  loadRequestsToMe,
} from "../../util/queries";
import FriendRequest from "../FriendRequest";

type Props = {
  refetchStatuses: () => any | Promise<any> | undefined | null;
  setShowScreen: Setter<ScreenName>;
};

const AddFriendForm: Component<Props> = (props) => {
  const user = useContext(AuthContext);
  const user_id = createMemo(() => user?.id || "");
  const [loadedRequests] = createResource(user_id(), loadRequestsToMe);
  const [friendRequests, setFriendRequests] = createStore<FriendRequest[]>([]);
  const [friendEmail, setFriendEmail] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  // Turn the async data into a store rather than a signal
  createEffect(() => {
    const returnedValue = loadedRequests();
    if (returnedValue) setFriendRequests(returnedValue);
  });

  // TODO Players should be able to share "friend request" links on social media
  // and maybe QR codes
  const sendRequest = async (e: Event) => {
    // Manage form
    e.preventDefault();
    setLoading(true);
    setMsg("Sending request...");

    // User entered their own email address
    if (friendEmail() === user?.email) {
      setMsg("You cannot send a request to yourself.");
      setLoading(false);
      return;
    }

    // User doesn't have a username
    const userProfile = await getUserProfile({ id: user_id() });
    if (!userProfile?.username) {
      setMsg(
        `You need a username to send a friend request.
        You can set your username in the Profile page.`
      );
      setLoading(false);
      return;
    }

    // Friend is not an existing user
    const friendData = await getUserProfile({ email: friendEmail() });
    if (!friendData) {
      const userProfile = await getUserProfile({ id: user_id() });
      const res = await fetch("/api/inviteByEmail", {
        method: "POST",
        body: JSON.stringify({
          friendEmail: friendEmail(),
          username: userProfile?.username,
        }),
      });
      if (res.ok) {
        await createRequest({ email: friendEmail() }, user_id());
        setMsg("New user invited to Motzash!");
      } else {
        setMsg("Something went wrong. Please contact Support.");
      }
      setLoading(false);
      return;
    }

    // Friendship request already exists
    const { id: friend_id } = friendData;
    const existingReq = await findFriendship(user_id(), friend_id);
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
    const requestCreated = await createRequest({ id: friend_id }, user_id());
    if (!requestCreated) {
      setMsg("Error creating friend request. Please contact support");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/inviteByEmail", {
      method: "POST",
      body: JSON.stringify({
        friendEmail: friendEmail(),
        username: userProfile?.username,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setMsg("Friend request sent!");
    }
    setLoading(false);
    return;
  };

  const [deleteEmail, setDeleteEmail] = createSignal("");
  const [msg2, setMsg2] = createSignal("");
  const [loading3, setLoading3] = createSignal(false);
  async function removeFriendship(e: Event) {
    e.preventDefault();
    setLoading3(true);
    const requestDeleted = await deleteRequest(user_id(), {
      email: deleteEmail(),
    });
    if (requestDeleted) {
      setMsg2("Friendship deleted.");
    } else {
      setMsg2("An error occurred. Please contact support.");
    }
    setLoading3(false);
    return;
  }

  return (
    <div class="col-span-6 lg:col-span-8 md:p-4 relative md:pt-10">
      <button
        class="absolute top-0 right-2 w-fit px-2 border border-black rounded
        bg-coral drop-shadow-small hover:drop-shadow-none transition-all z-10"
        onClick={() => props.setShowScreen(() => "Map")}
        type="button"
      >
        Back to map
      </button>
      <div class="space-y-10">
        <form onSubmit={sendRequest} class="space-y-2 relative max-w-lg">
          <h1 class="text-2xl font-header w-fit">Add a Friend</h1>
          <div class="space-y-2">
            <label for="friend">Enter your friend's email</label>
            <input
              type="email"
              name="friend"
              class="border border-black w-full px-2"
              maxLength={50}
              value={friendEmail()}
              onChange={(e) => setFriendEmail(e.currentTarget.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading()}
            class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
          bg-blue hover:drop-shadow-none disabled:drop-shadow-none transition-all"
          >
            Send request
          </button>
          <Show when={msg()}>
            <p class="text-coral2">{msg()}</p>
          </Show>
        </form>
        <div class="space-y-4" data-cy="friend-requests">
          <h1 class="text-2xl font-header">Friend requests</h1>
          <Switch fallback={<p>Loading...</p>}>
            <Match when={loadedRequests.state !== "ready"}>
              <p>Loading...</p>
            </Match>
            <Match when={friendRequests.length === 0}>
              <p>No friend requests at the moment!</p>
            </Match>
            <Match when={friendRequests.length > 0}>
              <For each={friendRequests}>
                {(friendRequest, idx) => {
                  const reqProps = {
                    idx: idx(),
                    friendRequest,
                    allRequests: friendRequests,
                    setFriendRequests,
                    user_id: user_id(),
                    refetchStatuses: props.refetchStatuses,
                  };
                  return <FriendRequest {...reqProps} />;
                }}
              </For>
            </Match>
          </Switch>
        </div>
        <form
          class="flex flex-col space-y-2 max-w-lg"
          action=""
          onSubmit={removeFriendship}
        >
          <h1 class="text-2xl font-header">Remove a Friendship</h1>
          <div class="space-y-2">
            <label for="remove">
              Enter the email of the friend who's connection you'd like to
              remove.
            </label>
            <input
              type="email"
              name="remove"
              class="border border-black w-full px-2"
              maxLength={50}
              value={deleteEmail()}
              onChange={(e) => setDeleteEmail(e.currentTarget.value)}
              required
              placeholder="Friend's email"
            />
          </div>
          <button
            type="submit"
            class="px-2 py-1 w-fit text-coral2 border border-coral2 rounded drop-shadow-small 
          bg-yellow2 hover:drop-shadow-none  disabled:drop-shadow-none transition-all"
            disabled={loading3()}
          >
            Remove
          </button>
          <p>{msg2()}</p>
        </form>
      </div>
    </div>
  );
};

export default AddFriendForm;
