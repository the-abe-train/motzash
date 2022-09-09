import { Component, createMemo, createSignal, For, Show } from "solid-js";
import { Location } from "@hebcal/core";

import { generateCalendar, findNextEvent } from "../util/datetime";

import HavdalahCandles from "../assets/Havdalah Static.svg";
import ShabbatCandles from "../assets/Candles Static.svg";

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
  const [displayDay, setDisplayDay] = createSignal(dayjs());

  const cal = generateCalendar(props.location);

  const weeks = createMemo(() => {
    const firstDayOfMonth = displayDay().date(0).weekday() + 1;
    const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;
    let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
    return [...Array(numWeeks)].map((_) => {
      return [...Array(7)].map((_) => {
        markerDay = markerDay.add(1, "day");
        const date = markerDay;
        const holidays = cal.filter((d) => {
          if (!d.eventTime) return false;
          return dayjs(d.eventTime).isSame(date, "date");
        });
        return { date, holidays } as CalendarDay;
      });
    });
  });

  const thisCandleLighting = () => {
    return findNextEvent(cal, "Candle lighting");
  };

  const thisHavdalah = () => {
    return findNextEvent(cal, "Havdalah", thisCandleLighting()?.day);
  };

  const nextCandleLighting = () => {
    return findNextEvent(cal, "Candle lighting", displayDay());
  };

  const nextHavdalah = () => {
    return findNextEvent(cal, "Havdalah", nextCandleLighting()?.day);
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

  return (
    <>
      <h1 class="text-2xl font-header">Candle Lighting</h1>
      <p>
        Get ready! {thisCandleLighting()?.event} starts{" "}
        {thisCandleLighting()?.day.calendar()}
      </p>
      <div class="flex justify-around bg-yellow1 p-3 border-2 border-black">
        <div class="flex items-center space-x-2">
          <img src={ShabbatCandles} alt="Shabbat candles" width={30} />
          <span class="font-header text-2xl lg:text-3xl">
            {thisCandleLighting()?.day.format("h:mm a")}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <img src={HavdalahCandles} alt="Havdalah candles" width={30} />
          <span class="font-header text-2xl lg:text-3xl">
            {thisHavdalah()?.day.format("h:mm a")}
          </span>
        </div>
      </div>
      <div class="p-2 flex flex-col space-y-3 w-full">
        <h1 class="text-2xl font-header">Calendar</h1>
        <div
          class="bg-ghost flex flex-col space-y-4 py-2  w-full border-2 border-black
        items-center"
        >
          <div class="flex w-full justify-center space-x-6 ">
            <button
              onClick={() => setDisplayDay((prev) => prev.subtract(1, "month"))}
            >
              &#8592;
            </button>
            <h2 class="text-center text-lg">
              {displayDay().format("MMMM YYYY")}
            </h2>
            <button
              onClick={() => setDisplayDay((prev) => prev.add(1, "month"))}
            >
              &#8594;
            </button>
          </div>
          <div
            class="bg-blue1 p-2 border-2 border-black max-w-[300px] w-max 
          drop-shadow-big"
          >
            <div class="bg-blue1 flex justify-between px-4 pb-1 ">
              <For each={dayHeaders}>
                {(day) => {
                  return <span class="border-none font-bold">{day}</span>;
                }}
              </For>
            </div>
            <table
              class="p-2 w-max
          text-lg border-2 border-black bg-ghost"
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
                                  "font-weight": chooseWeight(day),
                                  "background-color": chooseBgColour(day),
                                  color: chooseTextColour(day),
                                }}
                                class="text-center cursor-pointer px-[8px]"
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

          <p>
            {nextCandleLighting()?.event} starts{" "}
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
          <button
            onClick={() => setDisplayDay(dayjs())}
            class="p-2 border border-black rounded drop-shadow-small w-fit mx-auto
        bg-blue1 hover:drop-shadow-none transition-all"
          >
            Back to today
          </button>
        </div>
      </div>
    </>
  );
};

export default Calendar;
