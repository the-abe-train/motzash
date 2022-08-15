import { Component, lazy, Show, useContext } from "solid-js";
import { Routes, Route, Link, Outlet } from "@solidjs/router";
import Auth from "./pages/Auth";
import { AuthContext } from "./context/auth";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  const Protected: Component = () => {
    const session = useContext(AuthContext);
    return (
      <Show when={session()} fallback={<Auth />}>
        <Outlet />
      </Show>
    );
  };

  return (
    <div class="flex flex-col h-full">
      <header class="w-full px-4 bg-gray-100 h-fit">
        <nav class="flex w-full justify-between items-center h-14">
          <span>Motzash</span>
          <div class="flex space-x-10">
            <Link href="/">Dashboard</Link>
            <Link href="/friends">Friends</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" component={Dashboard} />
        <Route path="" component={Protected}>
          <Route path="/friends" component={Friends}></Route>
          <Route path="/profile" component={Profile}></Route>
        </Route>
      </Routes>
      <footer class="bg-gray-200 h-fit w-full">
        <div class="h-20">footer</div>
      </footer>
    </div>
  );
};

export default App;
