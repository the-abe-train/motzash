import { Subscription, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  createSignal,
  onCleanup,
  createEffect,
} from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { supabase } from "../util/supabase";

export const AuthContext = createContext<() => User | null>(() => null);

export function useAuth() {
  const user = useContext(AuthContext) as () => User | null;
  console.log("User updated:", user());
  return user;
}

// User signal is misleading. It doesn't update when signed out/in because the
// object doesn't change, only its properties.

export const AuthProvider: ContextProviderComponent<User | null> = (props) => {
  const [user, setUser] = createSignal<User | null>(props.value);

  let listener: Subscription | null;

  listener = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Subscription updated!");
    setUser(session?.user ?? null);
  }).subscription;
  console.log("Subscription", listener);

  onCleanup(() => {
    listener?.unsubscribe();
  });

  createEffect(() => console.log(user()));

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};
