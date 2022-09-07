import { createEffect, createResource, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import { loadVotes } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollWidget: WidgetComponent = (props) => {
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
  async function upsertVote(e: Event, voteText: string) {
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const { error } = await supabase.from("poll_votes").upsert(
      {
        widget_id: props.widget.id,
        user_id,
        text: voteText,
      },
      { onConflict: "text" }
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
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
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
    <div class="w-full">
      <h2 class="text-xl">{props.widget.name}</h2>
    </div>
  );
};

export default PollWidget;
