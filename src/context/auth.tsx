import { Session, Subscription } from "@supabase/supabase-js";
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

export const AuthContext = createContext<Accessor<Session | null>>(() => null);

const loadSession = async () => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) return null;
  return session;
};

export const AuthProvider: ContextProviderComponent<Session | null> = (
  props
) => {
  const [data, { mutate, refetch }] = createResource(loadSession);
  // console.log(data());

  const [session, setSession] = createSignal<Session | null>(null);

  let listener: Subscription | null;

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
    <AuthContext.Provider value={session}>
      {props.children}
    </AuthContext.Provider>
  );
};
