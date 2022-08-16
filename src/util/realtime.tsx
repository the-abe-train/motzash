import { createEffect, createResource, Setter } from "solid-js";
import { SetStoreFunction, StoreSetter } from "solid-js/store";

export function createSync<T>(setter: Setter<T>, loader: () => Promise<T>) {
  const [data, { mutate, refetch }] = createResource(loader);
  console.log("Data", data());
  createEffect(() => {
    const returnedValue = data();
    if (returnedValue) setter(() => returnedValue);
  });
  return data;
}
