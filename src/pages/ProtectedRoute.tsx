import { Outlet } from "@solidjs/router";
import { Component, Show } from "solid-js";
import Auth from "./Auth";

type Props = {
  isConnected: boolean;
};

const ProtectedRoute: Component<Props> = (props) => {
  return (
    <Show when={props.isConnected} fallback={<Auth />}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
