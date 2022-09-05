import {
  Component,
  createEffect,
  createResource,
  createSignal,
  lazy,
  onCleanup,
  onMount,
} from "solid-js";
import { Routes, Route, Link } from "@solidjs/router";
import About from "./pages/About";
import { supabase } from "./util/supabase";
import { Session, Subscription } from "@supabase/supabase-js";
import ProtectedRoute from "./pages/ProtectedRoute";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Friends = lazy(() => import("./pages/Friends"));
const Profile = lazy(() => import("./pages/Profile"));

const App: Component = () => {
  const loadSession = async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) return null;
    return session;
  };

  const [data, { mutate, refetch }] = createResource(loadSession);
  // console.log(data());

  const [session, setSession] = createSignal<Session | null>(null);

  let listener: Subscription | null;

  // TODO figure out if/why this doesn't load right away
  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) setSession(returnedValue);
    // console.log("Session updated.");
    // console.log("Session", session());
    // console.log("User:", supabase.auth.session()?.user);
  });

  onMount(() => {
    listener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    }).subscription;
  });

  onCleanup(() => {
    console.log("clean up");
    listener?.unsubscribe();
  });

  return (
    <div class="flex flex-col h-full justify-between">
      <header class="w-full px-4 bg-gray-100 h-fit">
        <nav class="flex w-full justify-between items-center h-14">
          <span>Motzash</span>
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
