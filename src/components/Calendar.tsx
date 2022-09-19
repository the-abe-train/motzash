import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import { Location } from "@hebcal/core";

import {
  generateCalendar,
  findNextEvent,
  currentEvent,
} from "../util/datetime";

import HavdalahCandles from "../assets/icons/Havdalah Static.svg";
import ShabbatCandles from "../assets/icons/Candles Static.svg";

import dayjs from "dayjs";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocation } from "../context/havdalah";
import { getColour } from "../util/holidays";
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

const Calendar: Component = () => {
  const [pageLocation, setPageLocation] = createSignal<Location | null>(null);
  const { location: contextLocation, getLocation } = useLocation();
  const [displayDay, setDisplayDay] = createSignal(dayjs());
  const [loading, setLoading] = createSignal(false);

  onMount(() => {
    setPageLocation(contextLocation());
  });

  async function getTimes() {
    setLoading(true);
    const newLocation = await getLocation();
    setPageLocation(newLocation);
    setLoading(false);
  }

  const cal = createMemo(() => {
    if (pageLocation()) return generateCalendar(pageLocation()!);
  });
  console.log(cal());

  const weeks = createMemo(() => {
    const firstDayOfMonth = displayDay().date(0).weekday() + 1;
    const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;
    let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
    return [...Array(numWeeks)].map((_) => {
      return [...Array(7)].map((_) => {
        markerDay = markerDay.add(1, "day");
        const date = markerDay;
        const holidays = (cal() || []).filter((d) => {
          const eventDate = d.eventTime
            ? dayjs(d.eventTime)
            : // @ts-ignore
              dayjs(d.date.greg());
          return eventDate.isSame(date, "date");
          // if (!d.eventTime) {
          //   return dayjs(d.date.greg())
          // } else {
          //   return dayjs(d.eventTime).isSame(date, "date");
          // }
        });
        return { date, holidays } as CalendarDay;
      });
    });
  });

  createEffect(() => {
    console.log("WEEKS");
    console.log(weeks);
  });
  console.log(weeks());

  const thisCandleLighting = () => {
    if (cal()) return findNextEvent(cal() || [], "Candle lighting");
  };

  const thisHavdalah = () => {
    if (cal())
      return findNextEvent(cal() || [], "Havdalah", thisCandleLighting()?.day);
  };

  const nextCandleLighting = () => {
    console.log("Finding next candle lighting");
    if (cal())
      return findNextEvent(cal() || [], "Candle lighting", displayDay());
  };

  const nextHavdalah = () => {
    if (cal())
      return findNextEvent(cal() || [], "Havdalah", nextCandleLighting()?.day);
  };

  const transitionCandles = () => {
    return "Havdalah";
  };

  // Calendar styling
  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  function chooseWeight(day: CalendarDay) {
    return day.date.isSame(displayDay(), "date") ? "bold" : "normal";
  }

  function chooseTextColour(day: CalendarDay) {
    return day.date.month() === displayDay().month() ? "inherit" : "#666";
  }

  const getLocationButton = (
    <>
      <button
        class="flex justify-around bg-yellow1 p-3 border-2 border-black 
rounded drop-shadow-small hover:drop-shadow-none active:drop-shadow-none
disabled:drop-shadow-none transition-all mx-auto"
        onClick={getTimes}
        disabled={loading()}
        data-cy="get-times-button"
      >
        <div class="flex items-center space-x-2">
          <img
            src={ShabbatCandles}
            alt="Shabbat candles"
            width={30}
            height={40}
          />
          <p>
            <span class="text-center font-bold hidden sm:inline">Click</span>
            <span class="text-center font-bold sm:hidden">Tap</span>{" "}
            <span class="text-center">
              to get Candle Lighting times using your live location!
            </span>
          </p>
          <img
            src={HavdalahCandles}
            alt="Havdalah candles"
            width={30}
            height={40}
          />
        </div>
      </button>
      <Show when={loading()}>
        <p>Getting candle lighting times...</p>
      </Show>
    </>
  );

  return (
    <div
      class="col-span-6 lg:col-span-4 row-span-2 flex flex-col space-y-10
    py-2"
    >
      <div class="space-y-3">
        <h1 class="text-2xl font-header">Candle Lighting</h1>
        <Show when={pageLocation()} fallback={getLocationButton}>
          <div class="flex flex-col space-y-3">
            <p>
              Get ready! {thisCandleLighting()?.event} starts on{" "}
              {thisCandleLighting()?.day.format("dddd [at] h:mm A")}
            </p>
            <div class="flex justify-around bg-yellow1 p-3 border-2 border-black">
              <div class="flex items-center space-x-2">
                <img
                  src={ShabbatCandles}
                  alt="Shabbat candles"
                  width={30}
                  height={40}
                />
                <span class="font-header text-3xl" data-cy="candles-time">
                  {thisCandleLighting()?.day.format("h:mm a")}
                </span>
              </div>
              <div class="flex items-center space-x-2">
                <img
                  src={HavdalahCandles}
                  alt="Havdalah candles"
                  width={30}
                  height={40}
                />
                <span class="font-header text-3xl" data-cy="havdalah-time">
                  {thisHavdalah()?.day.format("h:mm a")}
                </span>
              </div>
            </div>
          </div>
        </Show>
      </div>
      <div class="flex flex-col space-y-3 w-full">
        <h1 class="text-2xl font-header">Calendar</h1>
        <div
          class="bg-ghost flex flex-col space-y-5 py-4 px-4 w-full border-2 border-black
             items-center min-w-fit"
        >
          <div class="flex w-full justify-center space-x-4 ">
            <button
              class="text-2xl"
              onClick={() => setDisplayDay((prev) => prev.subtract(1, "month"))}
              data-cy="prev-month"
            >
              &#8592;
            </button>
            <h3
              class="text-center text-lg font-bold w-36 mt-[2px]"
              data-cy="month-name"
            >
              {displayDay().format("MMMM YYYY")}
            </h3>
            <button
              class="text-2xl"
              onClick={() => setDisplayDay((prev) => prev.add(1, "month"))}
              data-cy="next-month"
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
            <table
              class="px-2 py-4 w-full text-lg border-2 border-black 
             bg-ghost"
            >
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
                                  "background-color": getColour(day),
                                  color: chooseTextColour(day),
                                }}
                                class={`text-center cursor-pointer w-max
                                  hover:font-bold min-w-[30px]
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
          <Show when={cal()}>
            <div class="w-full px-3 space-y-2">
              <Show when={currentEvent(weeks(), displayDay())} keyed>
                {(eventDesc) => {
                  return (
                    <p>
                      {displayDay().format("MMM D")} is {eventDesc}.
                    </p>
                  );
                }}
              </Show>
              <div>
                <p>For {nextCandleLighting()?.event},</p>
                <div class="flex flex-wrap justify-between">
                  <span class="mr-3">
                    Candles:{" "}
                    {nextCandleLighting()?.day.format("h:mm A (MMM D)")}
                  </span>
                  <span class="mr-3">
                    {transitionCandles()}:{" "}
                    {nextHavdalah()?.day.format("h:mm A (MMM D)")}
                  </span>
                </div>
              </div>
            </div>
          </Show>
          <button
            onClick={() => setDisplayDay(dayjs())}
            class="border border-black rounded drop-shadow-small hover:drop-shadow-none transition-all
               w-fit mx-auto bg-blue px-2 py-1 "
            data-cy="back-to-today"
          >
            Back to today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
