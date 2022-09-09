import { greg } from "@hebcal/core";
import dayjs from "dayjs";
import { createContext, createSignal, useContext } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { generateCalendar } from "../util/datetime";
import { getHebcalLocation } from "../util/location";

type HavdalahCandle = () => Promise<number | null>;

const calculateHavdalah: HavdalahCandle = async () => {
  console.log("Calculating Havdalah");
  const location = await getHebcalLocation();
  const cal = generateCalendar(location);
  const havdalahDay = cal.find((event) => {
    const date = dayjs(event.eventTime);
    return date.isAfter(dayjs()) && event.desc === "Havdalah";
  });
  const havdalahRd = havdalahDay?.getDate().abs();
  return havdalahRd || null;
};

export const HavdalahContext = createContext<HavdalahCandle>();

export const HavdalahProvider: ContextProviderComponent<number | null> = (
  props
) => {
  const [havdalah, setHavdalah] = createSignal<number | null>(props.value);

  const getHavdalah = async () => {
    const today = greg.greg2abs(new Date());
    if (havdalah() && today <= (havdalah() || 0)) return havdalah();
    const newHavdalah = await calculateHavdalah();
    setHavdalah(newHavdalah);
    return newHavdalah;
  };

  return (
    <HavdalahContext.Provider value={getHavdalah}>
      {props.children}
    </HavdalahContext.Provider>
  );
};

export function useHavdalah() {
  return useContext(HavdalahContext) || calculateHavdalah;
}
