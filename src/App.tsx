import { Component, lazy, useContext } from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import About from "./pages/About";
import ProtectedRoute from "./pages/ProtectedRoute";
import { AuthContext } from "./context/auth";
// import logo from "./assets/Havdalah Dynamic.svg";
import Logo from "./assets/Havdalah Dynamic.svg";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  const session = useContext(AuthContext);

  return (
    <div class="flex flex-col h-full justify-between">
      <header class="w-full px-4 bg-gray-100 h-fit">
        <nav class="flex w-full justify-between items-center h-14">
          <div class="flex space-x-2 items-center">
            <object data={Logo} width={30}></object>
            <span class="text-2xl">Motzash</span>
          </div>
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
