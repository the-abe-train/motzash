/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/auth";
import { supabase } from "./util/supabase";

render(
  () => (
    <Router>
      <AuthProvider value={supabase.auth.session()}>
        <App />
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
