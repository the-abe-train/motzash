import { Subscription, User } from "@supabase/supabase-js";
import {
  createContext,
  createSignal,
  onCleanup,
  createEffect,
  onMount,
} from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { supabase } from "../util/supabase";

export const AuthContext = createContext<() => User | null>(() => null);

// User signal is misleading. It doesn't update when signed out/in because the
// object doesn't change, only its properties.

export const AuthProvider: ContextProviderComponent<User | null> = (props) => {
  const [user, setUser] = createSignal<User | null>(props.value);

  let listener: Subscription | null;

  listener = supabase.auth.onAuthStateChange(async (event, session) => {
    setUser(session?.user ?? null);
  }).subscription;

  onMount(async () => {
    const newUser = await supabase.auth.getUser();
    setUser(newUser.data.user);
  });

  onCleanup(() => {
    listener?.unsubscribe();
  });

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};
