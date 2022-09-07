/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./index.css";
import App from "./App";
import { AuthProvider, loadSession } from "./context/auth";

// No clue how top level await works here. Vite???
const session = await loadSession();

render(
  () => (
    <Router>
      <AuthProvider value={session}>
        <App />
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
