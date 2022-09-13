import { AuthSession, Subscription } from "@supabase/supabase-js";
import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  createResource,
  onMount,
} from "solid-js";
import {
  Accessor,
  ContextProviderComponent,
} from "solid-js/types/reactive/signal";
import { supabase } from "../util/supabase";

// The benefit of using a context here is that it's a *reactive* context.
// Thus when users sign in/out the app updates immediately.

export const AuthContext = createContext<AuthSession | null>(null);

export const loadSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  if (!data.session) return null;
  return data.session;
};

export const AuthProvider: ContextProviderComponent<AuthSession | null> = (
  props
) => {
  const [data, { mutate, refetch }] = createResource(loadSession);
  // console.log(data());

  const [session, setSession] = createSignal<AuthSession | null>(null);

  let listener: Subscription | null;

  onMount(() => {
    console.log("Auth context mounted with session", session()?.access_token);
    listener = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setSession(session);
        return;
      }
      setSession(null);
    }).subscription;
  });

  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) {
      setSession(returnedValue);
      console.log("Session set in context effect.");
    }
    // console.log("Session updated.");
    // console.log("Session", session());
    // console.log("User:", session()?.user);
  });

  onCleanup(() => {
    console.log("clean up");
    listener?.unsubscribe();
  });

  return (
    <AuthContext.Provider value={session()}>
      {props.children}
    </AuthContext.Provider>
  );
};
