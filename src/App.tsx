import { Component, lazy } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
const Home = lazy(() => import("./pages/Home"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  return (
    <>
      <div class="flex flex-col h-full">
        <header class="w-full px-4 bg-gray-100 h-fit">
          <nav class="flex w-full justify-between items-center h-14">
            <span>Motzash</span>
            <div class="flex space-x-10">
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
        <footer class="bg-gray-100 h-fit w-full">
          <div class="h-20">footer</div>
        </footer>
      </div>
    </>
  );
};

export default App;
