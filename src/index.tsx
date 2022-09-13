/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./styles/index.css";
import App from "./App";
// import { AuthProvider, loadSession } from "./context/auth";
import { HavdalahProvider } from "./context/havdalah";
import { AuthContext, AuthProvider } from "./context/auth2";
import { supabase } from "./util/supabase";

// No clue how top level await works here. Vite???
console.log("Index level loading.");
const user = await supabase.auth.getUser();
console.log(user);
// console.log("Session", session?.user.email);

render(
  () => (
    <Router>
      <AuthProvider value={{ user: user.data.user }}>
        <HavdalahProvider value={null}>
          <App />
        </HavdalahProvider>
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
