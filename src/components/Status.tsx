import { Accessor, Component, Setter } from "solid-js";

type Props = {
  status: FriendStatus | MyStatus | null | undefined;
  focus: Accessor<FriendStatus | MyStatus | null>;
  setFocus: Setter<FriendStatus | MyStatus | null>;
};

// Cannot destructure props because that would kill reactivity
const Status: Component<Props> = (props) => {
  if (!props.status) return <></>;
  const status = props.status;

  const isFocused = () => {
    return props.focus()?.id === status.id;
  };

  return (
    <div
      class="p-2 flex flex-col space-y-3 
      border-2 border-black"
      style={{ background: isFocused() ? "#FFBC42" : "#FFFF66" }}
      onClick={() => props.setFocus(status)}
    >
      <p class="text-sm">{props.status?.profiles?.username}</p>
      <p class="text-lg">"{props.status?.text}"</p>
      <p class="text-sm">{props.status?.city}</p>
    </div>
  );
};

export default Status;
