import { AuthSession } from "@supabase/supabase-js";
import {
  createContext,
  createEffect,
  createSignal,
  createResource,
} from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { getHavdalah } from "../util/datetime";

export const HavdalahContext = createContext<number | null>(null);

export const AuthProvider: ContextProviderComponent<AuthSession | null> = (
  props
) => {
  const [data, { mutate, refetch }] = createResource(getHavdalah);
  const [havdalah, setHavdalah] = createSignal<number | null>(null);

  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) setHavdalah(returnedValue);
  });

  return (
    <HavdalahContext.Provider value={havdalah()}>
      {props.children}
    </HavdalahContext.Provider>
  );
};
