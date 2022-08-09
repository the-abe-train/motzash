import type { Component } from "solid-js";
import {
  HebrewCalendar,
  HDate,
  Location,
  Event,
  CalOptions,
  flags,
  TimedEvent,
} from "@hebcal/core";
import invariant from "tiny-invariant";
import { parseFutureDate } from "../util/datetime";
import Calendar from "../components/Calendar";

function findNextEvent(cal: TimedEvent[], type: string, prev = new HDate()) {
  const nextEvent = cal.find((event) => {
    const eventHDate = event.getDate();
    return eventHDate.abs() > prev.abs() && event.desc === type;
  });
  invariant(nextEvent, "Next event not found on calendar");
  // console.log(nextEvent.eventTime);
  return nextEvent;
}

const Home: Component = () => {
  const calOptions: CalOptions = {
    // year: dayjs().year(),
    // month: dayjs().month(),
    isHebrewYear: false,
    numYears: 1,
    candlelighting: true,
    location: Location.lookup("Toronto"),
    // mask: flags.LIGHT_CANDLES,
  };
  const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];

  // TODO check if this flag accounts for chag, or if I need a separate one
  const nextCandleLighting = findNextEvent(cal, "Candle lighting");
  const nextHavdalah = findNextEvent(
    cal,
    "Havdalah"
    // nextCandleLighting?.getDate()
  );
  const countdown = parseFutureDate(nextCandleLighting.eventTime);

  return (
    <>
      <div class="flex flex-col h-full">
        <main class="grid grid-cols-12 gap-4 h-full">
          <aside class="col-span-3 border-r flex flex-col space-y-5 p-2">
            <h1 class="text-xl">Candle Lighting</h1>
            <p>Get ready! Shabbos starts in {countdown}</p>
            <div class="flex justify-around">
              <div class="flex flex-col items-center">
                <span>Candle Lighting</span>
                <span>{nextCandleLighting.eventTimeStr}</span>
              </div>
              <div class="flex flex-col items-center">
                <span>Motzash</span>
                <span>{nextHavdalah.eventTimeStr}</span>
              </div>
            </div>
            <Calendar />
          </aside>
        </main>
      </div>
    </>
  );
};

export default Home;
