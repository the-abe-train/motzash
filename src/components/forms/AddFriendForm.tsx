import { Component, createSignal, Resource, Setter } from "solid-js";

type Props = {
  myStatus: Resource<any>;
  setShowScreen: Setter<ScreenName>;
};

const AddFriendForm: Component<Props> = (props) => {
  const [friendHandle, setFriendHandle] = createSignal("");

  const sendRequest = () => {
    console.log("Request sent");
  };

  return (
    <div class="col-span-7">
      <form
        onSubmit={sendRequest}
        class=" flex flex-col space-y-4 p-4 relative"
      >
        <button
          class="absolute top-2 right-2
      w-fit px-2  border rounded
      bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          onClick={() => props.setShowScreen(() => "Map")}
        >
          X
        </button>
        <div class="flex flex-col space-y-2">
          <label for="text">Enter your friend's handle</label>
          <input
            type="text"
            name="text"
            class="border w-1/2 px-2"
            value={friendHandle()}
            onChange={(e) => setFriendHandle(e.currentTarget.value)}
          />
        </div>
        <button
          type="submit"
          class="w-fit p-2  border rounded
    bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        >
          Send request
        </button>
      </form>
      <h2 class="text-lg">Friend reqeusts</h2>
    </div>
  );
};

export default AddFriendForm;
