import {
  createEffect,
  createResource,
  createSignal,
  For,
  on,
  Show,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import Filter from "bad-words";
import { AuthContext } from "../../context/auth2";
import { loadPolls } from "../../util/queries";
import { supabase } from "../../util/supabase";
import Poll from "../../assets/icons/Poll.svg";

const PollMacro: WidgetPreviewComponent = (props) => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const [loadedPolls] = createResource(loadPolls, {
    initialValue: [],
  });

  const [polls, setPolls] = createStore({
    polls: [] as Poll[],
    get myPoll() {
      return this.polls.find((poll) => poll.user_id === user_id);
    },
    get othersPolls() {
      return this.polls.filter((poll) => poll.user_id !== user_id);
    },
  });
  const [newPoll, setNewPoll] = createSignal("");
  const [msg, setMsg] = createSignal("");

  createEffect(
    on(loadedPolls, () => {
      if (loadedPolls.state === "ready") {
        const returnedValue = loadedPolls();
        if (returnedValue) setPolls("polls", returnedValue);
        setMsg("");
      }
    })
  );

  async function addPoll(e: Event) {
    e.preventDefault();
    const filter = new Filter();
    if (filter.isProfane(newPoll() || "")) {
      setMsg("Please remove the profanity from the poll name.");
      return;
    }
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: newPoll(),
        user_id,
        type: "poll",
      })
      .select();
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
    }
    if (data) props.setActiveWidget(data[0]);
  }

  const fallback = () =>
    loadedPolls.state !== "ready" ? <p>Loading...</p> : <p>No polls yet.</p>;

  return (
    <div class="flex flex-col space-y-6 max-w-lg">
      <div class="space-y-3">
        <h2 class="font-header text-2xl">My Poll</h2>
        <Show
          when={polls.myPoll}
          keyed
          fallback={
            <form onSubmit={addPoll} class="flex w-full space-x-3">
              <input
                type="text"
                name="new-poll"
                maxLength={50}
                required
                value={newPoll()}
                onChange={(e) => setNewPoll(e.currentTarget.value)}
                class="px-2 py-1 flex-grow border border-black"
              />
              <button
                class="w-fit py-1 px-2 border border-black rounded
        bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
                type="submit"
              >
                Create poll
              </button>
            </form>
          }
        >
          {(myPoll) => {
            const numVotes = myPoll.poll_votes.length;
            const suffix = numVotes !== 1 ? "s" : "";
            const voteWord =
              (myPoll.name?.length || 0) > 15 ? "" : ` vote${suffix}`;
            const votesString = `(${numVotes}${voteWord})`;

            return (
              <div
                class="cursor-pointer bg-ghost flex space-x-2
              border border-black drop-shadow-small px-3 py-1
              hover:drop-shadow-none transition-all my-2 "
                onClick={() => props.setActiveWidget(myPoll)}
              >
                <img src={Poll} alt="Poll" />
                <p class="flex-grow overflow-ellipsis overflow-hidden">
                  {myPoll.name}
                </p>
                <span class="w-max">{votesString}</span>
              </div>
            );
          }}
        </Show>
      </div>
      <div class="space-y-3">
        <h2 class="font-header text-2xl">Friends' Polls</h2>
        <For each={polls.othersPolls} fallback={fallback}>
          {(poll) => {
            return (
              <div
                class="cursor-pointer bg-ghost flex space-x-2
              border border-black drop-shadow-small px-3 py-1
              hover:drop-shadow-none transition-all my-2"
                onClick={() => props.setActiveWidget(poll)}
              >
                <img src={Poll} alt="Poll" />
                <span class="flex-grow">{poll.name}</span>
                <span>({poll.poll_votes.length} votes)</span>
              </div>
            );
          }}
        </For>
      </div>
      <p>{msg}</p>
    </div>
  );
};

export default PollMacro;
