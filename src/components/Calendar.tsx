import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { CalOptions, Location, HebrewCalendar, TimedEvent } from "@hebcal/core";

import { findNextEvent } from "../util/datetime";

import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(relativeTime);

type Props = {
  location: Location | null;
};

const Calendar: Component<Props> = (props) => {
  // Create signal
  const [displayDay, setDisplayDay] = createSignal(dayjs());

  // Derived/memoized signals
  const cal = createMemo(() => {
    const calOptions: CalOptions = {
      isHebrewYear: false,
      candlelighting: true,
    };
    if (props.location) calOptions["location"] = props.location;
    return HebrewCalendar.calendar(calOptions) as TimedEvent[];
  });

  const weeks = createMemo(() => {
    const firstDayOfMonth = displayDay().date(0).weekday() + 1;
    const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;
    let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
    return [...Array(numWeeks)].map((_) => {
      return [...Array(7)].map((_) => {
        markerDay = markerDay.add(1, "day");
        const date = markerDay;
        const holidays = cal().filter((d) => {
          if (!d.eventTime) return false;
          return dayjs(d.eventTime).isSame(date, "date");
        });
        return { date, holidays } as CalendarDay;
      });
    });
  });

  const thisCandleLighting = () => {
    return findNextEvent(cal(), "Candle lighting");
  };

  const thisHavdalah = () => {
    return findNextEvent(cal(), "Havdalah", thisCandleLighting()?.day);
  };

  const nextCandleLighting = () => {
    return findNextEvent(cal(), "Candle lighting", displayDay());
  };

  const nextHavdalah = () => {
    return findNextEvent(cal(), "Havdalah", nextCandleLighting()?.day);
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
          return "yellow";
        case "Shabbat Chazon":
          return "yellow";
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
    return day.date.month() === displayDay().month() ? "inherit" : "gray";
  }

  return (
    <>
      <h1 class="text-xl">Candle Lighting</h1>
      <p>
        Get ready! {nextCandleLighting()?.event} starts{" "}
        {thisCandleLighting()?.day.calendar()}
      </p>
      <div class="flex justify-around">
        <div class="flex flex-col items-center">
          <span>Candles</span>
          <span>{thisCandleLighting()?.day.format("h:mm a")}</span>
        </div>
        <div class="flex flex-col items-center">
          <span>Havdalah</span>
          <span>{thisHavdalah()?.day.format("h:mm a")}</span>
        </div>
      </div>
      <div class="p-2 bg-slate-100 flex flex-col space-y-3">
        <h1 class="text-xl">Calendar</h1>
        <div class="flex w-full justify-around">
          <button
            onClick={() => setDisplayDay((prev) => prev.subtract(1, "month"))}
          >
            &#8592;
          </button>
          <h2 class="text-center">{displayDay().format("MMMM YYYY")}</h2>
          <button onClick={() => setDisplayDay((prev) => prev.add(1, "month"))}>
            &#8594;
          </button>
        </div>
        <table class="w-full p-2 border-2 border-gray-400">
          <colgroup>
            <col class="border" />
            <col class="border" />
            <col class="border" />
            <col class="border" />
            <col class="border" />
            <col class="border" />
            <col class="border" />
          </colgroup>
          <tbody>
            <tr>
              <For each={dayHeaders}>
                {(day) => {
                  return <th class="bg-gray-50">{day}</th>;
                }}
              </For>
            </tr>
            <For each={weeks()}>
              {(week) => {
                return (
                  <tr class="border">
                    <For each={week}>
                      {(day) => {
                        return (
                          <td
                            style={{
                              "font-weight": chooseWeight(day),
                              "background-color": chooseBgColour(day),
                              color: chooseTextColour(day),
                            }}
                            class="text-center cursor-pointer"
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
        <Show when={nextCandleLighting()}>
          <p>
            {nextCandleLighting()?.event} starts{" "}
            {nextCandleLighting()?.day.format("DD/MM/YYYY")}
          </p>
          <p>Candles: {nextCandleLighting()?.day.format("h:mm A")}</p>
        </Show>
        <p>Havdalah: {nextHavdalah()?.day.format("h:mm A")}</p>
        <button
          onClick={() => setDisplayDay(dayjs())}
          class="p-2 border w-fit
        bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        >
          Back to today
        </button>
      </div>
    </>
  );
};

export default Calendar;
