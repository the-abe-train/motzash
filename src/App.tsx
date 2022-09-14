import { Component, createSignal, lazy } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import ProtectedRoute from "./pages/ProtectedRoute";
import Logo from "./assets/icons/Havdalah Dynamic.svg";
import Footer from "./components/Footer";
import AuthPassword from "./pages/AuthPassword";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Sidebar = lazy(() => import("./components/Sidebar"));

const App: Component = () => {
  console.log("App level loading");
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [activeMacro, setActiveMacro] = createSignal<WidgetMacro | null>(null);
  const [activeWidget, setActiveWidget] = createSignal<Widget | null>(null);
  const dashboardProps = {
    activeMacro,
    setActiveMacro,
    activeWidget,
    setActiveWidget,
  };

  function resetDashboard() {
    setActiveWidget(null);
    setActiveMacro(null);
  }

  return (
    <div class="flex flex-col justify-between bg-yellow2 h-full">
      <header class="w-full h-fit border-b-2 border-black bg-yellow1">
        <nav
          class="flex justify-between items-center h-14 
        container w-full px-2 md:px-4 lg:px-6 mx-auto"
        >
          <Link href="/">
            <div class="flex space-x-2 items-center" onClick={resetDashboard}>
              <object data={Logo} width={25}></object>
              <span class="font-header text-3xl">Motzash</span>
            </div>
          </Link>
          <div
            class="md:flex space-x-10 text-lg hidden"
            onClick={resetDashboard}
          >
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
              class="left-1/2 top-2 block absolute h-[2px] bg-black rounded 
              transition-all"
              style={{
                width: sidebarOpen() ? 0 : "50%",
                transform: "translate(-50%, 0)",
              }}
            ></span>
            <span
              class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black 
              rounded transition-all"
              style={{ rotate: sidebarOpen() ? "45deg" : "inherit" }}
            ></span>
            <span
              class="left-1/4 top-4 block absolute h-[2px] w-1/2 bg-black 
              rounded transition-all"
              style={{ rotate: sidebarOpen() ? "-45deg" : "inherit" }}
            ></span>
            <span
              class="left-1/2 top-6 block absolute h-[2px] bg-black rounded 
              transition-all"
              style={{
                width: sidebarOpen() ? 0 : "50%",
                transform: "translate(-50%, 0)",
              }}
            ></span>
          </button>
        </nav>
      </header>
      <main
        class="grid grid-cols-6 md:grid-cols-12 gap-6 lg:gap-y-0 relative
     bg-yellow2 min-h-screen overflow-x-hidden
     container w-full px-2 md:px-4 lg:px-6 mx-auto"
      >
        <Sidebar sidebarOpen={sidebarOpen()} setSidebarOpen={setSidebarOpen} />

        <Routes>
          <Route path="/" element={<Dashboard {...dashboardProps} />} />
          <Route path="/signInWithPassword" component={AuthPassword} />
          <Route path="/about" component={About} />
          <Route path="" component={ProtectedRoute}>
            <Route path="/friends" component={Friends} />
            <Route path="/profile" component={Profile} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
