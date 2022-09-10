import { Component, lazy, useContext } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthContext } from "./context/auth";
import Logo from "./assets/Havdalah Dynamic.svg";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));

const App: Component = () => {
  const session = useContext(AuthContext);

  return (
    <div class="flex flex-col justify-between bg-yellow2 h-full">
      <header class="w-full h-fit border-b-2 border-black bg-yellow1">
        <nav
          class="flex w-full px-8 justify-between items-center h-14 
        container mx-auto"
        >
          <div class="flex space-x-2 items-center">
            <object data={Logo} width={25}></object>
            <span class="font-header text-3xl">Motzash</span>
          </div>
          <div class="flex space-x-10 text-lg">
            <Link class="hover:font-bold" href="/">
              Dashboard
            </Link>
            <Link class="hover:font-bold" href="/friends">
              Friends
            </Link>
            <Link class="hover:font-bold" href="/about">
              About
            </Link>
            <Link class="hover:font-bold" href="/profile">
              Profile
            </Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" component={Dashboard} />
        <Route path="/about" component={About} />
        <Route path="" element={<ProtectedRoute isConnected={!!session()} />}>
          <Route path="/friends" component={Friends} />
          <Route path="/profile" component={Profile} />
        </Route>
      </Routes>
      <footer class="bg-black text-yellow2 h-fit w-full mt-6">
        <div class="h-20">footer</div>
      </footer>
    </div>
  );
};

export default App;
