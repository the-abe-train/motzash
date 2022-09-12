/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./styles/index.css";
import App from "./App";
import { AuthProvider, loadSession } from "./context/auth";
import { HavdalahProvider } from "./context/havdalah";

// No clue how top level await works here. Vite???
const session = await loadSession();
console.log("Sessoin", session);

render(
  () => (
    <Router>
      <AuthProvider value={session}>
        <HavdalahProvider value={null}>
          <App />
        </HavdalahProvider>
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
