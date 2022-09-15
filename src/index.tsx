/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./styles/index.css";
import App from "./App";
import { SpaceTimeProvider } from "./context/havdalah";
import { AuthProvider } from "./context/auth2";
import { supabase } from "./util/supabase";
import { UserResponse } from "@supabase/supabase-js";

// No clue how top level await works here. Vite???
let user: UserResponse;
try {
  user = await supabase.auth.getUser();
} catch (e) {
  console.log("User not authenticated.");
}

render(
  () => (
    <Router>
      <AuthProvider value={user.data.user}>
        <SpaceTimeProvider value={{ location: null, havdalah: null }}>
          <App />
        </SpaceTimeProvider>
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
