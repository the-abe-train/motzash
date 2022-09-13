import { Subscription, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  children,
  Accessor,
} from "solid-js";
import { createStore } from "solid-js/store";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { supabase } from "../util/supabase";

type UserStore = {
  user: User | null;
};

// create a context for authentication
export const AuthContext = createContext<UserStore>({ user: null });

export const AuthProvider: ContextProviderComponent<UserStore> = (props) => {
  // create state values for user data and loading
  console.log("Props", props.value);
  let listener: Subscription | null;
  const [user, setUser] = createStore<UserStore>(props.value);
  // supabase.auth
  //   .getSession()
  //   .then((data) => setUser(data.data.session?.user || null));
  const c = children(() => props.children);

  console.log(user.user);

  // onMount(async () => {
  //   // get session data if there is an active session
  //   console.log("Mounting context");
  //   const session = await supabase.auth.getSession();
  //   console.log("Mounted context");
  //   setUser(session.data.session?.user ?? null);
  // });

  createEffect(() => {
    // listen for changes to auth
    listener = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Subscription updated");
      // setUser(session?.user || null);
      setUser("user", session?.user || null);
    }).subscription;
  });

  // createEffect(() => {
  //   console.log("Effect: User is changing!");
  //   console.log(user.user?.id);
  // });

  onCleanup(() => {
    console.log("Cleaning up");
    listener?.unsubscribe();
  });

  // create signUp, signIn, signOut functions
  // const value = {
  //   email: user()?.email,
  // };

  // use a provider to pass down the value
  return <AuthContext.Provider value={user}>{c()}</AuthContext.Provider>;
};

export function useAuth() {
  const a = useContext(AuthContext);
  console.log(a);
  return a;
  // console.log(a);
  // if (a) {
  //   console.log("a", a());
  //   return a;
  // }
  // return () => null;
}
