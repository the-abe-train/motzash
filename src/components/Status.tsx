import { Component, For } from "solid-js";

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

export default Status;
