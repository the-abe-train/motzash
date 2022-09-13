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
import { AuthContext } from "../../context/auth2";
import { useHavdalah } from "../../context/havdalah";
import { loadVotes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollWidget: WidgetComponent = (props) => {
  const user = useContext(AuthContext);
  const user_id = user()?.id;
  const getHavdalah = useHavdalah();
  const myVoteDefault: Vote = {
    user_id,
    text: "",
    widget_id: props.widget.id,
  };

  // Signals and stores
  const [votes, setVotes] = createStore<Vote[]>([]);
  const [myVote, setMyVote] = createStore<Vote>(myVoteDefault);
  const [msg, setMsg] = createSignal("");
  const pollAuthor = () => {
    return "profiles" in props.widget
      ? props.widget.profiles.username
      : "Anonymous";
  };

  // Load recipe data
  const [loadedVotes, { refetch }] = createResource(props.widget.id, loadVotes);
  createEffect(
    on(loadedVotes, () => {
      if (loadedVotes.state === "ready") {
        const returnedValue = loadedVotes();
        if (returnedValue) {
          setVotes(returnedValue);
          const findMyVote = votes.find((vote) => vote.user_id === user_id);
          setMyVote(findMyVote || {});
        }
      }
    })
  );

  // Functions
  function updateMsg() {
    setMsg("Vote updated!");
    setTimeout(() => setMsg(""), 3000);
  }

  async function upsertVote(e: Event) {
    e.preventDefault();
    const havdalah = await getHavdalah();
    if (!havdalah) {
      setMsg("Please turn on location services to cast a vote.");
      return;
    }
    const newVote = { ...myVote, havdalah };
    const { error } = await supabase.from("poll_votes").upsert(newVote);
    if (error) {
      console.error(error.message);
      setMsg("An error occurred, please contact support.");
      return;
    }
    refetch();
    updateMsg();
  }

  async function deleteVote(e: Event) {
    e.preventDefault();
    const { error } = await supabase
      .from("poll_votes")
      .delete()
      .match({ widget_id: props.widget.id, user_id });
    if (error) {
      console.error(error.message);
      return;
    }
    setMyVote("text", "");
    setMyVote("id", 0);
    refetch();
  }

  async function deletePoll(e: Event) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this poll?")) {
      const { error } = await supabase
        .from("widgets")
        .delete()
        .eq("id", props.widget.id);
      if (error) {
        console.error(error.message);
        setMsg("Failed to delete poll. Please contact support.");
        refetch();
        return;
      }
      props.setActiveWidget(null);
    }
  }

  return (
    <div class="w-full flex flex-col space-y-4">
      <h2 class="font-header text-2xl">{props.widget.name}</h2>
      <p>Poll created by {pollAuthor()}</p>
      <div>
        <h3 class="text-lg font-bold">Votes</h3>
        <For each={votes}>
          {(vote) => {
            return <p>{vote.text}</p>;
          }}
        </For>
      </div>
      <div class="">
        <h3 class="text-lg font-bold">Change vote</h3>
        <form onSubmit={upsertVote}>
          <input
            name="vote"
            class="px-2 py-1 border border-black w-full"
            value={myVote?.text || ""}
            onChange={(e) => setMyVote("text", e.currentTarget.value)}
            required
          />
          <div class="my-1 space-x-2">
            <Show when={myVote.id}>
              <button
                class="w-fit py-1 px-2 border border-black rounded
           bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
                type="button"
                onClick={deleteVote}
              >
                Remove
              </button>
            </Show>
            <button
              class="w-fit py-1 px-2 border border-black rounded
         bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
              type="submit"
            >
              {myVote.id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <Show when={props.widget.user_id === user_id}>
        <button
          onClick={deletePoll}
          class="w-fit py-1 px-2 border border-black rounded
          mt-8 bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
        >
          Delete poll
        </button>
      </Show>
      <p>{msg()}</p>
    </div>
  );
};

export default PollWidget;
