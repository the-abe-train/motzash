import { AuthSession, Subscription } from "@supabase/supabase-js";
// import {
//   createContext,
//   createEffect,
//   createSignal,
//   onCleanup,
//   createResource,
//   onMount,
//   useContext,
// } from "solid-js";
// import { ContextProviderComponent } from "solid-js/types/reactive/signal";
// import { supabase } from "../util/supabase";

// // The benefit of using a context here is that it's a *reactive* context.
// // Thus when users sign in/out the app updates immediately.

// export const loadSession = async () => {
//   const { data, error } = await supabase.auth.getSession();
//   if (error) return null;
//   if (!data.session) return null;
//   return data.session;
// };

// export const AuthContext = createContext<AuthSession>();

// export const AuthProvider: ContextProviderComponent<AuthSession | undefined> = (
//   props
// ) => {
//   const [session, setSession] = createSignal<AuthSession | undefined>(
//     props.value
//   );

//   const [data] = createResource(loadSession);
//   createEffect(() => {
//     const returnedValue = data();
//     if (returnedValue) {
//       setSession(returnedValue);
//       console.log("Session set in context effect.");
//     }
//   });

//   let listener: Subscription | null;
//   onMount(() => {
//     listener = supabase.auth.onAuthStateChange(async (_event, session) => {
//       if (session) {
//         setSession(session);
//         return;
//       }
//     }).subscription;
//   });

//   onCleanup(() => {
//     console.log("clean up");
//     listener?.unsubscribe();
//   });

//   return (
//     <AuthContext.Provider value={session()}>
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

// export function useEmail() {
//   return useContext(AuthContext)?.user.email;
// }
