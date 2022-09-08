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

const PollMacro: WidgetPreviewComponent = (props) => {
  const session = useContext(AuthContext);
  const [loadedPolls] = createResource(loadPolls, {
    initialValue: [],
  });

  const [polls, setPolls] = createStore<Widget[]>([]);
  const [newPoll, setNewPoll] = createSignal("");
  const [msg, setMsg] = createSignal("Loading...");
  const [loading, setLoading] = createSignal(true);

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
    setLoading(true);
    const user_id = session()?.user.id || "";
    const { data, error } = await supabase
      .from("widgets")
      .insert({
        name: newPoll(),
        user_id,
        type: "poll",
      })
      .select();
    setLoading(false);
    if (error) {
      console.error(error.message);
      setMsg("Failed to create new widget.");
    }
    if (data) props.setActiveWidget(data[0]);
  }

  const myPoll = () => {
    const myPollArray = polls.filter((poll) => {
      return poll.id === props.widgets[0]?.id;
    });
    if (myPollArray.length > 0) return myPollArray[0];
    return null;
  };

  return (
    <div class="flex flex-col space-y-4">
      <h2 class="text-xl">My Poll</h2>
      <Show when={!myPoll()}>
        <form onSubmit={addPoll}>
          <input
            type="text"
            value={newPoll()}
            onChange={(e) => setNewPoll(e.currentTarget.value)}
          />
          <button>Create poll</button>
        </form>
      </Show>
      <For each={polls}>
        {(poll) => {
          if (poll.id === props.widgets[0]?.id)
            return (
              <p
                class="cursor-pointer"
                onClick={() => props.setActiveWidget(poll)}
              >
                {poll.name}
              </p>
            );
        }}
      </For>
      <h2 class="text-xl">Friends' Polls</h2>
      <For each={polls}>
        {(poll) => {
          if (poll.id !== props.widgets[0]?.id)
            return (
              <p
                class="cursor-pointer"
                onClick={() => props.setActiveWidget(poll)}
              >
                {poll.name}
              </p>
            );
        }}
      </For>
      <p>{msg}</p>
    </div>
  );
};

export default PollMacro;
