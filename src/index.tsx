/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./index.css";
import App from "./App";
import { AuthProvider, loadSession } from "./context/auth";
import { getHavdalah } from "./util/datetime";
import { HavdalahContext } from "./context/havdalah";

// No clue how top level await works here. Vite???
const session = await loadSession();
const havdalah = await getHavdalah();

render(
  () => (
    <Router>
      <AuthProvider value={session}>
        <HavdalahContext.Provider value={havdalah}>
          <App />
        </HavdalahContext.Provider>
      </AuthProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
