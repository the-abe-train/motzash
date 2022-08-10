import { Component, createSignal, For, Match, Switch } from "solid-js";
import statuses from "../data/statuses.json";
import FriendMap from "../components/FriendMap";

const Status: Component<Status> = ({ name, text, tags }) => {
  return (
    <div class="bg-gray-100 p-2 mx-2 rounded flex flex-col space-y-3">
      <p>{name}</p>
      <p>{text}</p>
      <ul class="flex flex-wrap gap-3">
        <For each={tags}>
          {(tag) => {
            return <li class="border rounded p-1 bg-slate-200">{tag}</li>;
          }}
        </For>
      </ul>
    </div>
  );
};

const Friends: Component = () => {
  const [showForm, setShowForm] = createSignal(false);
  function toggleShowForm() {
    setShowForm((prev) => !prev);
  }
  return (
    <main class="grid grid-cols-12 gap-4 flex-grow">
      <aside
        class="col-span-5 lg:col-span-5 xl:col-span-4 
          border-r flex flex-col space-y-5 p-4 "
      >
        <h2>Your Status</h2>
        <button
          class="w-full h-20 rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          onClick={toggleShowForm}
          disabled={showForm()}
        >
          Add status
        </button>
        <h2>Your Friends</h2>
        <div class="flex flex-col space-y-3 max-h-[60vh] overflow-y-scroll">
          <For each={statuses}>
            {(status) => {
              return <Status {...status} />;
            }}
          </For>
        </div>
      </aside>
      <Switch fallback={<div>Loading...</div>}>
        <Match when={showForm()}>
          <form
            onSubmit={(e) => e.preventDefault()}
            class="col-span-7 flex flex-col space-y-4 p-4 relative"
          >
            <button
              class="absolute top-2 right-2
                w-fit px-2  border rounded
                bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
              onClick={toggleShowForm}
            >
              X
            </button>
            <div class="flex flex-col space-y-2">
              <label for="text">What are you up to on Shabbos?</label>
              <input type="text" name="text" class="border w-1/2" />
            </div>
            <div class="flex flex-col space-y-2">
              <label for="location">Where are you gonna be?</label>
              <input type="text" name="location" class="border w-1/2" />
            </div>
            <button
              type="submit"
              class="w-fit p-2  border rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
              onClick={toggleShowForm}
            >
              Update status
            </button>
          </form>
        </Match>
        <Match when={!showForm()}>
          <FriendMap statuses={statuses} />
        </Match>
      </Switch>
    </main>
  );
};

export default Friends;
