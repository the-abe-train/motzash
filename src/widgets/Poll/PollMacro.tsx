import { createEffect, createResource, createSignal, For, on } from "solid-js";
import { createStore, SetStoreFunction } from "solid-js/store";
import { loadPolls } from "../../util/queries";
import { supabase } from "../../util/supabase";

const PollMacro: WidgetPreviewComponent = (props) => {
  const [loadedPolls] = createResource(loadPolls, {
    initialValue: [],
  });

  const [polls, setPolls] = createStore<Widget[]>([]);
  const [msg, setMsg] = createSignal("Loading...");

  createEffect(
    on(loadedPolls, () => {
      if (loadedPolls.state === "ready") {
        const returnedValue = loadedPolls();
        if (returnedValue) setPolls(returnedValue);
        setMsg("");
      }
    })
  );

  return (
    <div class="flex flex-col space-y-4">
      <h2 class="text-xl">My Poll</h2>
      <For each={polls}>
        {(poll) => {
          if (poll.id === props.widgets[0].id)
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
          if (poll.id !== props.widgets[0].id)
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
