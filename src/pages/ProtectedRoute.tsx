import { Outlet } from "@solidjs/router";
import {
  Component,
  createEffect,
  createSignal,
  Show,
  useContext,
} from "solid-js";
import { AuthContext, useAuth } from "../context/auth2";
import Auth from "./Auth";

const ProtectedRoute: Component = () => {
  const u = useContext(AuthContext);
  console.log("U", u);
  // const user = useAuth();
  const [showUser, setShowUser] = createSignal("");
  const fallback = (
    <div class="col-span-12 my-6">
      <Auth inWidget={false} />
      <button class="border p-2 bg-white" onClick={() => console.log(u?.user)}>
        Show user
      </button>
      <p>{showUser()}</p>
    </div>
  );

  createEffect(() => {
    console.log("Auth", u);
  });
  return (
    <Show when={u.user} fallback={fallback}>
      <Outlet />
    </Show>
  );
};

export default ProtectedRoute;
