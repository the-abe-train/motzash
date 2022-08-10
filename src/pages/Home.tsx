import type { Component } from "solid-js";
import { HebrewCalendar, Location, CalOptions, TimedEvent } from "@hebcal/core";
import Calendar from "../components/Calendar";
import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import { findNextEvent } from "../util/datetime";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

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

  return (
    <>
      <main class="grid grid-cols-12 gap-4">
        <aside class="col-span-3 border-r flex flex-col space-y-5 p-2">
          <h1 class="text-xl">Candle Lighting</h1>
          <p>Get ready! Shabbos starts {nextCandleLighting.date.calendar()}</p>
          <div class="flex justify-around">
            <div class="flex flex-col items-center">
              <span>Candle Lighting</span>
              <span>{nextCandleLighting.date.format("h:mm a")}</span>
            </div>
            <div class="flex flex-col items-center">
              <span>Motzash</span>
              <span>{nextHavdalah.date.format("h:mm a")}</span>
            </div>
          </div>
          <Calendar />
        </aside>
      </main>
    </>
  );
};

export default Home;
