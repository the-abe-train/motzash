import { Component, createSignal, lazy, onMount, useContext } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthContext, AuthProvider, loadSession } from "./context/auth";
import Logo from "./assets/icons/Havdalah Dynamic.svg";
import Footer from "./components/Footer";
import AuthPassword from "./pages/AuthPassword";
import { Session } from "@supabase/supabase-js";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Sidebar = lazy(() => import("./components/Sidebar"));

const App: Component = () => {
  const [session, setSession] = createSignal<Session | null>(null);
  onMount(async () => {
    console.log("App level loading");
    // const session = useContext(AuthContext);
    const newSession = await loadSession();
    if (newSession) setSession(newSession);
    console.log("App mounted session", session()?.access_token);
  });
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  return (
    <AuthProvider value={session()}>
      <div class="flex flex-col justify-between bg-yellow2 h-full">
        <header class="w-full h-fit border-b-2 border-black bg-yellow1">
          <nav
            class="flex justify-between items-center h-14 
        container w-full px-2 md:px-4 lg:px-6 mx-auto"
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
          class="grid grid-cols-6 md:grid-cols-12 gap-6 relative
     bg-yellow2 min-h-screen overflow-x-hidden
     container w-full px-2 md:px-4 lg:px-6 mx-auto"
        >
          <Sidebar
            sidebarOpen={sidebarOpen()}
            setSidebarOpen={setSidebarOpen}
          />
          <Routes>
            <Route path="/" component={Dashboard} />
            <Route path="/signInWithPassword" component={AuthPassword} />
            <Route path="/about" component={About} />
            <Route
              path=""
              element={<ProtectedRoute isConnected={!!session()} />}
            >
              <Route path="/friends" component={Friends} />
              <Route path="/profile" component={Profile} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
