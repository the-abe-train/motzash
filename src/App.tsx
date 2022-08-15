import {
  Component,
  createEffect,
  createSignal,
  lazy,
  Show,
  useContext,
} from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import Auth from "./pages/Auth";
import { AuthContext } from "./context/auth";
const Home = lazy(() => import("./pages/Home"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  const session = useContext(AuthContext);

  // const [userSession, setUserSession] = createSignal(session());
  // console.log(session);

  // createEffect(() => console.log(userSession()));

  return (
    <div class="flex flex-col h-full">
      <header class="w-full px-4 bg-gray-100 h-fit">
        <nav class="flex w-full justify-between items-center h-14">
          <span>Motzash</span>
          <div class="flex space-x-10">
            <Link href="/">Dashboard</Link>
            <Link href="/friends">Friends</Link>
            <Link href="/about">About</Link>
            {/* {} */}
            {/* <Link href="/auth">Auth</Link> */}
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
      </header>
      <Routes>
        <Route path="/" component={Home} />
      </Routes>
      <Show when={session()} fallback={<Auth />}>
        <Routes>
          <Route path="/friends" component={Friends}></Route>
          <Route path="/profile" component={Profile}></Route>
        </Routes>
      </Show>
      <footer class="bg-gray-200 h-fit w-full">
        <div class="h-20">footer</div>
      </footer>
    </div>
  );
};

export default App;
