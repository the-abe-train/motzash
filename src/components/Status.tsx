import { Component, For } from "solid-js";

// interface Props extends Status {
//   name: string;
// }

type Props = {
  status?: Status;
  name: string;
};

// Cannot destructure props because that would kill reactivity
const Status: Component<Props> = (props) => {
  return (
    <div class="bg-gray-100 p-2 mx-2 rounded flex flex-col space-y-3">
      <p>{props.name}</p>
      <p>{props?.status?.text}</p>
      <ul class="flex flex-wrap gap-3">
        <For each={props?.status?.tags}>
          {(tag) => {
            return <li class="border rounded p-1 bg-slate-200">{tag}</li>;
          }}
        </For>
      </ul>
    </div>
  );
};

export default Status;
