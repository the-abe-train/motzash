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
import { HavdalahContext } from "../../context/havdalah";
import { loadVotes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollWidget: WidgetComponent = (props) => {
  const session = useContext(AuthContext);
  const havdalah = useContext(HavdalahContext);
  const myVoteDefault: Vote = {
    user_id: session()?.user.id,
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
  const [loadedVotes, { refetch }] = createResource(async () =>
    loadVotes(props.widget.id)
  );
  createEffect(
    on(loadedVotes, () => {
      if (loadedVotes.state === "ready") {
        const returnedValue = loadedVotes();
        if (returnedValue) {
          setVotes(returnedValue);
          const findMyVote = votes.find(
            (vote) => vote.user_id === session()?.user.id
          );
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
    const newVote = { ...myVote, havdalah };
    console.log("New vote", newVote);
    const { error } = await supabase.from("poll_votes").upsert(newVote);
    if (error) {
      console.error(error.message);
      setMsg("An error occurred, please contact support.");
      return;
    }
    updateMsg();
    refetch();
  }

  async function deleteVote(e: Event) {
    e.preventDefault();
    const user_id = session()?.user.id || "";
    const { error } = await supabase
      .from("poll_votes")
      .delete()
      .match({ widget_id: props.widget.id, user_id });
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    updateMsg();
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
      <h2 class="text-xl">{props.widget.name}</h2>
      <p>Poll created by {pollAuthor()}</p>
      <div>
        <h3 class="text-lg">Votes</h3>
        <For each={votes}>
          {(vote) => {
            return <p>{vote.text}</p>;
          }}
        </For>
      </div>
      <div>
        <h3 class="text-lg">Change vote</h3>
        <form class="flex space-x-2 w-fit" onSubmit={upsertVote}>
          <input
            name="vote"
            class="w-40 px-2"
            value={myVote?.text || ""}
            onChange={(e) => setMyVote("text", e.currentTarget.value)}
            required
          />
          <button
            class="p-2 border border-black w-fit
            bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
            type="button"
            onClick={deleteVote}
          >
            Remove
          </button>
          <button
            class="p-2 border border-black w-fit
        bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <Show when={props.widget.user_id === session()?.user.id}>
        <h3 class="text-lg">Delete poll</h3>
        <button onClick={deletePoll} class="w-fit border border-black">
          Delete
        </button>
      </Show>
      <p>{msg()}</p>
    </div>
  );
};

export default PollWidget;
