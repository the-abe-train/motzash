import { Component, lazy, useContext } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import About from "./pages/About";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthContext } from "./context/auth";
import Logo from "./assets/Havdalah Dynamic.svg";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  const session = useContext(AuthContext);

  return (
    <div class="flex flex-col h-full justify-between bg-yellow2">
      <header class="w-full px-4 h-fit border-b-2 border-black bg-yellow1">
        <nav class="flex w-full justify-between items-center h-14 container mx-auto">
          <div class="flex space-x-2 items-center">
            <object data={Logo} width={25}></object>
            <span class="font-header text-3xl">Motzash</span>
          </div>
          <div class="flex space-x-10 text-lg">
            <Link href="/">Dashboard</Link>
            <Link href="/friends">Friends</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" component={Dashboard} />
        <Route path="/about" component={About} />
        <Route path="" element={<ProtectedRoute isConnected={!!session()} />}>
          {/* <Route path="" component={ProtectedRoute({isConnected: false})}> */}
          <Route path="/friends" component={Friends} />
          <Route path="/profile" component={Profile} />
        </Route>
      </Routes>
      <footer class="bg-gray-200 h-fit w-full">
        <div class="h-20">footer</div>
      </footer>
    </div>
  );
};

export default App;
