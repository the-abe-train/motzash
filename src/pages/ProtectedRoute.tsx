import { Outlet } from "@solidjs/router";
import { Component, Show } from "solid-js";
import Auth from "./Auth";

type Props = {
  isConnected: boolean;
};

const fallback = (
  <div class="col-span-12 my-6">
    <Auth inWidget={false} />
  </div>
);

const ProtectedRoute: Component<Props> = (props) => {
  return (
    <Show when={props.isConnected} fallback={fallback}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
