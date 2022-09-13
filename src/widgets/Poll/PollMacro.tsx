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
import { AuthContext } from "../../context/auth";
import { loadPolls } from "../../util/queries";
import { supabase } from "../../util/supabase";
import Poll from "../../assets/icons/Poll.svg";

const PollMacro: WidgetPreviewComponent = (props) => {
  const session = useContext(AuthContext);
  const [loadedPolls] = createResource(loadPolls, {
    initialValue: [],
  });

  const [polls, setPolls] = createStore<Poll[]>([]);
  const [newPoll, setNewPoll] = createSignal("");
  const [msg, setMsg] = createSignal("");

  createEffect(
    on(loadedPolls, () => {
      if (loadedPolls.state === "ready") {
        const returnedValue = loadedPolls();
        if (returnedValue) setPolls(returnedValue);
        setMsg("");
      }
    })
  );

  async function addPoll(e: Event) {
    e.preventDefault();
    const user_id = session()?.user.id || "";
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

  const myPoll = () =>
    polls.find((poll) => {
      return poll.user_id === session()?.user.id;
    });

  const fallback = () =>
    loadedPolls.state === "ready" ? <p>No polls yet.</p> : <p>Loading...</p>;

  return (
    <div class="flex flex-col space-y-6">
      <div class="space-y-3">
        <h2 class="font-header text-2xl">My Poll</h2>
        <Show
          when={myPoll()}
          keyed
          fallback={
            <form onSubmit={addPoll} class="flex w-full space-x-3">
              <input
                type="text"
                required
                value={newPoll()}
                onChange={(e) => setNewPoll(e.currentTarget.value)}
                class="px-2 py-1 flex-grow border border-black"
              />
              <button
                class="w-fit py-1 px-2 border border-black rounded
        bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
              >
                Create poll
              </button>
            </form>
          }
        >
          {(myPoll) => {
            return (
              <div
                class="cursor-pointer bg-ghost flex space-x-2
              border border-black drop-shadow-small px-3 py-1
              hover:drop-shadow-none transition-all my-2"
                onClick={() => props.setActiveWidget(myPoll)}
              >
                <img src={Poll} alt="Poll" />
                <span class="flex-grow">{myPoll.name}</span>
                <span>({myPoll.poll_votes.length} votes)</span>
              </div>
            );
          }}
        </Show>
      </div>
      <div class="space-y-3">
        <h2 class="font-header text-2xl">Friends' Polls</h2>
        <For each={polls} fallback={fallback}>
          {(poll) => {
            if (poll.id !== props.widgets[0]?.id)
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
