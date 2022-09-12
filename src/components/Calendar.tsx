import {
  Component,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { Location } from "@hebcal/core";

import { generateCalendar, findNextEvent } from "../util/datetime";

import HavdalahCandles from "../assets/icons/Havdalah Static.svg";
import ShabbatCandles from "../assets/icons/Candles Static.svg";

import dayjs from "dayjs";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import { getHebcalLocation } from "../util/location";
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

const Calendar: Component = () => {
  const [location, setLocation] = createSignal<Location | null | undefined>();
  const [displayDay, setDisplayDay] = createSignal(dayjs());

  onMount(async () => {
    const newLocation = await getHebcalLocation();
    setLocation(newLocation);
  });

  const cal = createMemo(() => {
    if (location()) return generateCalendar(location()!);
  });

  const weeks = createMemo(() => {
    if (cal()) {
      const firstDayOfMonth = displayDay().date(0).weekday() + 1;
      const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;
      let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
      return [...Array(numWeeks)].map((_) => {
        return [...Array(7)].map((_) => {
          markerDay = markerDay.add(1, "day");
          const date = markerDay;
          const holidays = (cal() || []).filter((d) => {
            if (!d.eventTime) return false;
            return dayjs(d.eventTime).isSame(date, "date");
          });
          return { date, holidays } as CalendarDay;
        });
      });
    }
  });

  const thisCandleLighting = () => {
    if (cal()) return findNextEvent(cal() || [], "Candle lighting");
  };

  const thisHavdalah = () => {
    if (cal())
      return findNextEvent(cal() || [], "Havdalah", thisCandleLighting()?.day);
  };

  const nextCandleLighting = () => {
    if (cal())
      return findNextEvent(cal() || [], "Candle lighting", displayDay());
  };

  const nextHavdalah = () => {
    if (cal())
      return findNextEvent(cal() || [], "Havdalah", nextCandleLighting()?.day);
  };

  // Calendar styling
  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  function chooseWeight(day: CalendarDay) {
    return day.date.isSame(displayDay(), "date") ? "bold" : "normal";
  }

  function chooseBgColour(day: CalendarDay) {
    const regex = /^[^:]*/;
    // console.log(day.date.date(), day.holidays);
    if (!day.holidays) return "white";
    for (let h of day.holidays) {
      const holiday = h.desc.match(regex);
      if (!holiday) return "white";
      switch (holiday[0]) {
        case "Candle lighting":
          return "orange";
        case "Havdalah":
          return "rgba(255, 107, 127, 1)";
        case "Shabbat Chazon":
          return "rgba(255, 107, 127, 1)";
        case "Fast begins":
          return "lightgreen";
        case "Fast ends":
          return "lightblue";
        case "Chanukah":
          return "pink";
        default:
          return "white";
      }
    }
  }

  function chooseTextColour(day: CalendarDay) {
    return day.date.month() === displayDay().month() ? "inherit" : "#666";
  }

  console.log(thisCandleLighting());

  return (
    <div
      class="col-span-6 lg:col-span-4 row-span-2 flex flex-col space-y-5 
    py-2"
    >
      <Show
        when={location}
        fallback={
          <p>
            Please allow location permissions to view candle lighting times.
          </p>
        }
      >
        <Show when={thisCandleLighting()} fallback={<p>Loading...</p>}>
          <div class="flex flex-col space-y-3">
            <h1 class="text-2xl font-header">Candle Lighting</h1>
            <p>
              Get ready! {thisCandleLighting()?.event} starts on{" "}
              {thisCandleLighting()?.day.format("dddd [at] h:mm A")}
            </p>
            <div class="flex justify-around bg-yellow1 p-3 border-2 border-black">
              <div class="flex items-center space-x-2">
                <img src={ShabbatCandles} alt="Shabbat candles" width={30} />
                <span class="font-header text-3xl">
                  {thisCandleLighting()?.day.format("h:mm a")}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <img src={HavdalahCandles} alt="Havdalah candles" width={30} />
                <span class="font-header text-3xl">
                  {thisHavdalah()?.day.format("h:mm a")}
                </span>
              </div>
            </div>
          </div>
        </Show>
        <div class="flex flex-col space-y-3 w-full">
          <h1 class="text-2xl font-header">Calendar</h1>
          <div
            class="bg-ghost flex flex-col space-y-5 py-4 px-4 w-full border-2 border-black
        items-center min-w-fit"
          >
            <div class="flex w-full justify-center space-x-4 ">
              <button
                class="text-2xl"
                onClick={() =>
                  setDisplayDay((prev) => prev.subtract(1, "month"))
                }
              >
                &#8592;
              </button>
              <h2 class="text-center text-lg w-36 mt-[2px]">
                {displayDay().format("MMMM YYYY")}
              </h2>
              <button
                class="text-2xl"
                onClick={() => setDisplayDay((prev) => prev.add(1, "month"))}
              >
                &#8594;
              </button>
            </div>
            <div
              class="bg-blue p-2 border-2 border-black max-w-[300px] w-full 
          drop-shadow-small"
            >
              <div class="bg-blue flex justify-between px-4 pb-1 ">
                <For each={dayHeaders}>
                  {(day) => {
                    return <span class="border-none font-bold">{day}</span>;
                  }}
                </For>
              </div>
              <table class="px-2 py-4 w-full text-lg border-2 border-black bg-ghost">
                <colgroup>
                  <col class="border border-black" />
                  <col class="border border-black" />
                  <col class="border border-black" />
                  <col class="border border-black" />
                  <col class="border border-black" />
                  <col class="border border-black" />
                  <col class="border border-black" />
                </colgroup>
                <tbody>
                  <For each={weeks()}>
                    {(week) => {
                      return (
                        <tr class="border border-black">
                          <For each={week}>
                            {(day) => {
                              return (
                                <td
                                  style={{
                                    "background-color": chooseBgColour(day),
                                    color: chooseTextColour(day),
                                  }}
                                  class={`text-center cursor-pointer w-max
                                  hover:font-bold 
                                  font-${chooseWeight(day)}`}
                                  onClick={() => setDisplayDay(day.date)}
                                >
                                  {day.date.date()}
                                </td>
                              );
                            }}
                          </For>
                        </tr>
                      );
                    }}
                  </For>
                </tbody>
              </table>
            </div>

            <div>
              <p>
                For {nextCandleLighting()?.event} on{" "}
                {nextCandleLighting()?.day.format("DD/MM/YYYY")}
              </p>
              <div class="flex flex-wrap">
                <span class="mr-3">
                  Candles: {nextCandleLighting()?.day.format("h:mm A")}
                </span>
                <span class="mr-3">
                  Havdalah: {nextHavdalah()?.day.format("h:mm A")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setDisplayDay(dayjs())}
              class="px-2 py-1 border border-black rounded drop-shadow-small w-fit mx-auto
        bg-blue hover:drop-shadow-none transition-all"
            >
              Back to today
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default Calendar;
