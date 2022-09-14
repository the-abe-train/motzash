import {
  Component,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  For,
  Match,
  Setter,
  Switch,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { AuthContext } from "../../context/auth2";
import {
  createRequest,
  deleteRequest,
  findFriendship,
  getUser as getUserProfile,
  loadRequestsToMe,
} from "../../util/queries";
import FriendRequestComponent from "../FriendRequest";

type Props = {
  refetchStatuses: () => any | Promise<any> | undefined | null;
  setShowScreen: Setter<ScreenName>;
};

const AddFriendForm: Component<Props> = (props) => {
  const user = useContext(AuthContext);
  const [loadedRequests] = createResource(loadRequestsToMe);
  const [friendRequests, setFriendRequests] = createStore<FriendRequest[]>([]);
  const [friendEmail, setFriendEmail] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const user_id = createMemo(() => user()?.id || "");

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
    if (friendEmail() === user()?.email) {
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
      console.log(data);
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
    const requestDeleted = await deleteRequest({ email: deleteEmail() });
    if (requestDeleted) {
      setMsg2("Friendship deleted.");
    } else {
      setMsg2("An error occurred. Please contact support.");
    }
    setLoading3(false);
    return;
  }

  return (
    <div
      class="col-span-6 lg:col-span-8 p-4 relative pt-8
    flex flex-col space-y-4 justify-between max-w-lg"
    >
      <button
        class="absolute top-2 right-2 w-fit px-2 border border-black rounded
        bg-coral drop-shadow-small hover:drop-shadow-none transition-all"
        onClick={() => props.setShowScreen(() => "Map")}
        type="button"
      >
        Back to map
      </button>
      <form
        onSubmit={sendRequest}
        class="flex flex-col space-y-4 relative max-w-lg"
      >
        <h1 class="text-2xl font-header">Add a Friend</h1>
        <div class="flex flex-col space-y-2 ">
          <label for="text">Enter your friend's email</label>
          <input
            type="email"
            name="text"
            class="border border-black w-full px-2"
            value={friendEmail()}
            onChange={(e) => setFriendEmail(e.currentTarget.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading()}
          class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
          bg-blue hover:drop-shadow-none transition-all"
        >
          Send request
        </button>
        <p>{msg()}</p>
      </form>
      <div class="my-8">
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
                return <FriendRequestComponent {...reqProps} />;
              }}
            </For>
          </Match>
        </Switch>
      </div>
      <form
        class="flex flex-col space-y-2"
        action=""
        onSubmit={removeFriendship}
      >
        <h1 class="text-2xl font-header">Remove a Friendship</h1>
        <label for="remove">
          Enter the email of the friend who's connection you'd like to remove.
        </label>
        <input
          type="email"
          name="text"
          class="border border-black w-full px-2"
          value={deleteEmail()}
          onChange={(e) => setDeleteEmail(e.currentTarget.value)}
          required
          placeholder="Friend's email"
        />
        <button
          type="submit"
          class="px-2 py-1 w-fit text-coral2 border border-coral2 rounded drop-shadow-small 
          bg-yellow2 hover:drop-shadow-none transition-all"
          disabled={loading3()}
        >
          Remove
        </button>
        <p>{msg2()}</p>
      </form>
    </div>
  );
};

export default AddFriendForm;
