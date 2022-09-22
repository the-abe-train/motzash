import { Subscription, User } from "@supabase/supabase-js";
import { createContext, onCleanup, onMount, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { supabase } from "../util/supabase";

export const AuthContext = createContext<Partial<User>>({});

// User signal is misleading. It doesn't update when signed out/in because the
// object doesn't change, only its properties.

export const AuthProvider: ContextProviderComponent<User | null> = (props) => {
  const [user, setUser] = createStore<Partial<User>>(props.value || {});

  let listener: Subscription | null;

  onMount(async () => {
    const newUser = await supabase.auth.getUser();
    setUser(newUser.data.user || { id: "" });
    listener = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change");
      console.log(event);
      // setUser(session?.user || { id: "" });
      if (event === "SIGNED_IN" && session) {
        setUser(session.user);
        // SupabaseAuthService.user.next(session.user); // if using observables
      } else if (session === null) {
        setUser({});
        // SupabaseAuthService.user.next(null); // if using observables
      }
      window.location.reload();
      // this.loadProfile(); // etc.
    }).subscription;
  });

  createEffect(() => {
    console.log("User has changed");
    console.log(user.id);
  });

  onCleanup(() => {
    listener?.unsubscribe();
  });

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};
