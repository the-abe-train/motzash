import { Component, createSignal, lazy } from "solid-js";
import { Routes, Route } from "@solidjs/router";
import ProtectedRoute from "./pages/ProtectedRoute";

import Footer from "./components/navigation/Footer";
import Sidebar from "./components/navigation/Sidebar";
import Header from "./components/navigation/Header";
import AuthPassword from "./pages/AuthPassword";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));

const App: Component = () => {
  const [sidebarOpen, setSidebarOpen] = createSignal(false);
  const [activeMacro, setActiveMacro] = createSignal<WidgetMacro | null>(null);
  const [activeWidget, setActiveWidget] = createSignal<Widget | null>(null);
  const dashboardProps = {
    activeMacro,
    setActiveMacro,
    activeWidget,
    setActiveWidget,
  };
  const headerProps = {
    ...dashboardProps,
    sidebarOpen: sidebarOpen(),
    setSidebarOpen,
  };

  return (
    <div class="flex flex-col justify-between bg-yellow2 h-full">
      <Header {...headerProps} />
      <div class="min-h-screen relative overflow-x-hidden">
        <Sidebar sidebarOpen={sidebarOpen()} setSidebarOpen={setSidebarOpen} />
        <main
          class="grid grid-cols-6 md:grid-cols-12 gap-6 lg:gap-y-0 relative
     bg-yellow2 container w-full px-2 md:px-4 lg:px-6 mx-auto"
        >
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
      </div>
      <Footer />
    </div>
  );
};

export default App;
