import { Component, createSignal, lazy, useContext } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthContext } from "./context/auth";
import Logo from "./assets/Havdalah Dynamic.svg";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Sidebar = lazy(() => import("./components/Sidebar"));

const App: Component = () => {
  const session = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <div class="flex flex-col justify-between bg-yellow2 h-full">
      <header class="w-full h-fit border-b-2 border-black bg-yellow1">
        <nav
          class="flex w-full px-2 md:px-4 lg:px-6 justify-between items-center h-14 
        container mx-auto"
        >
          <div class="flex space-x-2 items-center">
            <object data={Logo} width={25}></object>
            <span class="font-header text-3xl">Motzash</span>
          </div>
          <div class="md:flex space-x-10 text-lg hidden">
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
          <button
            class="w-10 h-9 relative md:hidden"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span
              class="left-1/2 top-2 block absolute h-[2px] bg-black rounded transition-all"
              style={{
                width: sidebarOpen() ? 0 : "50%",
                transform: "translate(-50%, 0)",
              }}
            ></span>
            <span
              class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black rounded transition-all"
              style={{ rotate: sidebarOpen() ? "45deg" : "inherit" }}
            ></span>
            <span
              class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black rounded transition-all"
              style={{ rotate: sidebarOpen() ? "-45deg" : "inherit" }}
            ></span>
            <span
              class="left-1/2 top-6 block absolute h-[2px] bg-black rounded transition-all"
              style={{
                width: sidebarOpen() ? 0 : "50%",
                transform: "translate(-50%, 0)",
              }}
            ></span>
          </button>
        </nav>
      </header>
      <main
        class="grid grid-cols-6 md:grid-cols-12 gap-6 relative
    py-2 px-4 container mx-auto bg-yellow2 min-h-screen overflow-x-hidden"
      >
        <Sidebar sidebarOpen={sidebarOpen()} setSidebarOpen={setSidebarOpen} />
        <Routes>
          <Route path="/" component={Dashboard} />
          <Route path="/about" component={About} />
          <Route path="" element={<ProtectedRoute isConnected={!!session()} />}>
            <Route path="/friends" component={Friends} />
            <Route path="/profile" component={Profile} />
          </Route>
        </Routes>
      </main>

      <footer class="bg-black text-yellow2 h-fit w-full mt-6">
        <div class="h-20 flex w-full px-8 justify-between container mx-auto">
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
      </footer>
    </div>
  );
};

export default App;
