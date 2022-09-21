import {
  createEffect,
  createResource,
  createSignal,
  on,
  Show,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import Filter from "bad-words";
import BarChart from "../../components/BarChart";
import { AuthContext } from "../../context/auth2";
import { useHavdalah } from "../../context/havdalah";
import { loadVotes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollWidget: WidgetComponent = (props) => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const getHavdalah = useHavdalah();
  const myVoteDefault: Vote = {
    user_id,
    widget_id: props.widget.id,
  };

  // Signals and stores
  const [votes, setVotes] = createStore({
    votes: [] as Vote[],
    get tally() {
      return this.votes.reduce((output, { text }) => {
        if (text) {
          if (text in output) {
            output[text] += 1;
          } else {
            output[text] = 1;
          }
        }
        return output;
      }, {} as ChartData);
    },
    get myVote() {
      return this.votes.find((vote) => vote.user_id === user_id);
    },
  });

  const [newVote, setNewVote] = createStore<Vote>(myVoteDefault);
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
          setVotes("votes", returnedValue);
          if (votes.myVote) setNewVote(votes.myVote);
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
    const filter = new Filter();
    if (filter.isProfane(newVote.text || "")) {
      setMsg("Please remove the profanity from your vote.");
      return;
    }
    const upsert = { ...newVote, havdalah };
    const { error } = await supabase.from("poll_votes").upsert(upsert);
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
    setNewVote("text", "");
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
    <div class="w-full flex flex-col space-y-4 max-w-lg ">
      <h2 class="font-header text-2xl">{props.widget.name}</h2>
      <p>Poll created by {pollAuthor()}</p>
      <div>
        <h3 class="text-lg font-bold">Votes</h3>
        <Show when={votes.tally} keyed>
          {(tally) => {
            // Need the tally to be keyed or it won't re-reneder when the
            // data updates.
            return <BarChart data={tally} />;
          }}
        </Show>
      </div>
      <div class="max-w-md ">
        <h3 class="text-lg font-bold">Change vote</h3>
        <form onSubmit={upsertVote}>
          <input
            name="vote"
            maxLength={20}
            class="px-2 py-1 border border-black w-full"
            value={votes.myVote?.text || ""}
            onChange={(e) => setNewVote("text", e.currentTarget.value)}
            required
          />
          <div class="my-1 space-x-2">
            <Show when={votes.myVote?.id}>
              <button
                class="w-fit py-1 px-2 border border-black rounded
           bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
                type="button"
                onClick={deleteVote}
                data-cy="remove-vote-button"
              >
                Remove
              </button>
            </Show>
            <button
              class="w-fit py-1 px-2 border border-black rounded
         bg-ghost drop-shadow-small hover:drop-shadow-none transition-all"
              type="submit"
            >
              {votes.myVote?.id ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
      <p class="my-8">{msg()}</p>
      <Show when={props.widget.user_id === user_id}>
        <button
          onClick={deletePoll}
          class="w-max py-1 px-2 border rounded my-6
          bg-none text-black border-black"
          data-cy="delete-button"
        >
          Delete poll
        </button>
      </Show>
    </div>
  );
};

export default PollWidget;
