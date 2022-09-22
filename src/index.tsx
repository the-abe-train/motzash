/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "tailwindcss/tailwind.css";

import "./styles/index.css";
import App from "./App";
import { SpaceTimeProvider } from "./context/havdalah";
import { AuthProvider } from "./context/auth2";

render(() => {
  return (
    <Router>
      <AuthProvider value={null}>
        <SpaceTimeProvider value={{ location: null, havdalah: null }}>
          <App />
        </SpaceTimeProvider>
      </AuthProvider>
    </Router>
  );
}, document.getElementById("root") as HTMLElement);
