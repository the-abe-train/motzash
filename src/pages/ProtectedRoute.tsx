import { Outlet } from "@solidjs/router";
import { Component, createEffect, Show, useContext } from "solid-js";
import { AuthContext } from "../context/auth2";
import Auth from "./Auth";

const ProtectedRoute: Component = () => {
  const user = useContext(AuthContext);

  createEffect(() => {
    // Without this effect, the reactivity doesn't work.
    // I hate that, but it's the truth, what you gonna do.
    console.log(user());
  });

  const fallback = (
    <div class="col-span-12 my-6">
      <Auth inWidget={false} />
    </div>
  );

  createEffect(() => {
    console.log("Protected route user:", user()?.id);
  });

  return (
    <Show when={user()?.id} fallback={fallback}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
