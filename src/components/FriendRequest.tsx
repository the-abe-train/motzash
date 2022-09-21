import { Component, Switch, Match, createSignal } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import { supabase } from "../util/supabase";

type Props = {
  idx: number;
  friendRequest: FriendRequest;
  allRequests: FriendRequest[];
  setFriendRequests: SetStoreFunction<FriendRequest[]>;
  user_id: string;
  refetchStatuses: () => any | Promise<any> | undefined | null;
};

const FriendRequest: Component<Props> = (props) => {
  const [loading2, setLoading2] = createSignal(false);

  async function acceptRequest(idx: number, requester_id: string) {
    setLoading2(true);
    const { error } = await supabase
      .from("friendships")
      .update({ accepted: true })
      .match({ friend_id: props.user_id, requester_id });
    if (error) {
      setLoading2(false);
      return;
    }
    props.refetchStatuses();
    props.setFriendRequests(idx, "accepted", true);
    setLoading2(false);
  }

  async function rejectRequest(idx: number, requester_id: string) {
    setLoading2(true);
    const { data, error } = await supabase
      .from("friendships")
      .delete()
      .match({ friend_id: props.user_id, requester_id });
    if (error) {
      console.error(error);
      setLoading2(false);
      return;
    }
    setLoading2(false);
    props.refetchStatuses();
  }
  return (
    <form
      action=""
      class="flex justify-between items-center p-5
      border-2 drop-shadow-small border-black bg-yellow1"
      onSubmit={(e) => e.preventDefault()}
      data-cy={props.friendRequest.requester.username}
    >
      <p class="">{props.friendRequest.requester.username}</p>
      <Switch>
        <Match when={props.friendRequest.accepted}>
          <p>Accepted!</p>
        </Match>
        <Match when={!props.friendRequest.accepted}>
          <div class="flex space-x-4 items-center">
            <button
              disabled={loading2()}
              class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
              mx-auto bg-blue hover:drop-shadow-none transition-all"
              onClick={() =>
                acceptRequest(props.idx, props.friendRequest.requester.id)
              }
              data-cy="accept-button"
            >
              Accept
            </button>
            <button
              disabled={loading2()}
              class="px-2 py-1 w-fit text-coral border border-coral rounded drop-shadow-small 
              bg-yellow1 hover:drop-shadow-none transition-all"
              onClick={() =>
                rejectRequest(props.idx, props.friendRequest.requester.id)
              }
            >
              Delete
            </button>
          </div>
        </Match>
      </Switch>
    </form>
  );
};

export default FriendRequest;
