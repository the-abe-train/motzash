/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./styles/index.css";
import App from "./App";
import { AuthProvider, loadSession } from "./context/auth";
import { HavdalahProvider } from "./context/havdalah";

// No clue how top level await works here. Vite???
console.log("Index level loading.");
const session = await loadSession();
console.log("Session", session);

render(
  () => (
    <Router>
      <HavdalahProvider value={null}>
        <App />
      </HavdalahProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
