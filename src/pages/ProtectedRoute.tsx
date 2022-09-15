import { Outlet } from "@solidjs/router";
import { Component, createEffect, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth2";
import Auth from "./Auth";

const ProtectedRoute: Component = () => {
  const user = useContext(AuthContext);

  createEffect(() => {
    // Without this effect, the reactivity doesn't work.
    // I hate that, but it's the truth, what you gonna do.
    // TODO I think user needs to be a store to fix this
    console.log(user.id);
  });

  const fallback = (
    <div class="col-span-12 my-6">
      <Auth inWidget={false} />
    </div>
  );

  return (
    <Show when={user.id} fallback={fallback}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
