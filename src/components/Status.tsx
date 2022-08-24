import { Component, For } from "solid-js";

// interface Props extends Status {
//   name: string;
// }

type Props = {
  status: {
    user_id: string;
    location: {
      lat: number | null;
      lng: number | null;
    };
    tags: string[] | null;
    city: string | null;
    created_at: string | null;
    text: string | null;
    id: number;
  } & {
    profiles: { username: string };
  };
};

// Cannot destructure props because that would kill reactivity
const Status: Component<Props> = (props) => {
  return (
    <div class="bg-gray-100 p-2 mx-2 rounded flex flex-col space-y-3">
      <p class="text-sm">{props.status?.profiles?.username}</p>
      <p>{props.status?.text}</p>
      <ul class="flex flex-wrap gap-3">
        <For each={props.status?.tags}>
          {(tag) => {
            return <li class="border rounded p-1 bg-slate-200">{tag}</li>;
          }}
        </For>
      </ul>
      <p class="text-sm">{props.status?.city}</p>
    </div>
  );
};

export default Status;
