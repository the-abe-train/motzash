import { greg, Location } from "@hebcal/core";
import dayjs from "dayjs";
import { Accessor, createContext, createSignal, useContext } from "solid-js";
import { ContextProviderComponent } from "solid-js/types/reactive/signal";
import { generateCalendar } from "../util/datetime";
import { getHebcalLocation } from "../util/location";

type SpaceTimeContext = {
  location: Location | null;
  havdalah: number | null;
};

type HavdalahContextProps = () => Promise<number | null>;

type LocationContextProps = {
  location: Accessor<Location | null>;
  getLocation: () => Promise<Location | null>;
};

export const LocationContext = createContext<LocationContextProps>({
  location: () => null,
  getLocation: () => new Promise((res) => res(null)),
});

export const HavdalahContext = createContext<HavdalahContextProps>(
  () => new Promise((res) => res(null))
);

export const SpaceTimeProvider: ContextProviderComponent<SpaceTimeContext> = (
  props
) => {
  const [location, setLocation] = createSignal<Location | null>(null);
  const [havdalah, setHavdalah] = createSignal<number | null>(null);

  const getLocation = async () => {
    if (!location()) {
      const newLocation = await getHebcalLocation();
      setLocation(newLocation);
      return newLocation;
    }
    return location();
  };

  const calculateHavdalah = async () => {
    const location = await getLocation();
    const cal = generateCalendar(location!);
    const havdalahDay = cal.find((event) => {
      const date = dayjs(event.eventTime);
      return date.isAfter(dayjs()) && event.desc === "Havdalah";
    });
    const havdalahRd = havdalahDay?.getDate().abs();
    return havdalahRd || null;
  };

  const getHavdalah = async () => {
    const today = greg.greg2abs(new Date());
    if (havdalah() && today <= (havdalah() || 0)) return havdalah();
    const newHavdalah = await calculateHavdalah();
    setHavdalah(newHavdalah);
    return newHavdalah;
  };

  return (
    <LocationContext.Provider value={{ location, getLocation }}>
      <HavdalahContext.Provider value={getHavdalah}>
        {props.children}
      </HavdalahContext.Provider>
    </LocationContext.Provider>
  );
};

export function useLocation() {
  return useContext(LocationContext);
}

export function useHavdalah() {
  return useContext(HavdalahContext);
}
