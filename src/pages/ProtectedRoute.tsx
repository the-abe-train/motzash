import { Outlet } from "@solidjs/router";
import { Component, createEffect, Show, useContext } from "solid-js";
import { AuthContext, useAuth } from "../context/auth2";
import Auth from "./Auth";

const ProtectedRoute: Component = () => {
  const auth = useAuth();
  const user_id = auth()?.id;
  const user = useContext(AuthContext);

  createEffect(() => {
    console.log(auth);
    console.log(user_id);
    console.log(user());
  });

  const fallback = (
    <div class="col-span-12 my-6">
      <Auth inWidget={false} />
    </div>
  );

  createEffect(() => {
    console.log("Protected route user:", user_id);
  });

  return (
    <Show when={user()?.id} fallback={fallback}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
