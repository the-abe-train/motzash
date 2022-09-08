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
import { loadVotes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollWidget: WidgetComponent = (props) => {
  const session = useContext(AuthContext);
  // Signals and stores
  const [votes, setVotes] = createStore<Vote[]>([]);
  const [newVote, setNewVote] = createSignal("");
  const [msg, setMsg] = createSignal("");

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
        }
      }
    })
  );

  // Functions
  function updateMsg() {
    setMsg("Vote updated!");
    setTimeout(() => setMsg(""), 3000);
  }

  // TODO getting user id from the database constantly is probably very bad
  // I should almost definitely be storing it in context after all.
  async function upsertVote(e: Event) {
    e.preventDefault();
    const user_id = session()?.user.id || "";
    const { error } = await supabase.from("poll_votes").upsert(
      {
        widget_id: props.widget.id,
        user_id,
        text: newVote(),
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error(error.message);
      refetch();
      return;
    }
    updateMsg();
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
            name="ingredient"
            class="w-40"
            value={newVote()}
            onChange={(e) => setNewVote(e.currentTarget.value)}
          />
          <button
            class="p-1 border border-black"
            type="button"
            onClick={deleteVote}
          >
            Remove
          </button>
          <button class="p-1 border border-black" type="submit">
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
    </div>
  );
};

export default PollWidget;
