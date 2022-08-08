import { Component, lazy } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
const Home = lazy(() => import("./pages/Home"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  return (
    <>
      <div class="flex flex-col h-full">
        <header class="w-full px-4 bg-gray-100 h-14">
          <nav class="flex w-full justify-between h-full items-center">
            <span>Motzash</span>
            <div class="flex space-x-4">
              <Link href="/">Dashboard</Link>
              <Link href="/friends">Friends</Link>
              <Link href="/profile">Profile</Link>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/friends" component={Friends}></Route>
          <Route path="/profile" component={Profile}></Route>
        </Routes>
        <footer class="bg-gray-100 h-20 w-full">footer</footer>
      </div>
    </>
  );
};

export default App;
