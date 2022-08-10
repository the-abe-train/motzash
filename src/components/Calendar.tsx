import { createSignal, For } from "solid-js";
import {
  CalOptions,
  Location,
  HebrewCalendar,
  TimedEvent,
  HDate,
} from "@hebcal/core";
import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import objectSupport from "dayjs/plugin/objectSupport";
import { findNextEvent } from "../util/datetime";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(objectSupport);

export default function Calendar() {
  // Create signal
  const [displayDay, setDisplayDay] = createSignal(dayjs());

  // Derived signals
  const cal = () => {
    const year = displayDay().year();
    const month = displayDay().month();
    const calOptions: CalOptions = {
      year,
      month: month + 1,
      isHebrewYear: false,
      candlelighting: true,
      location: Location.lookup("Toronto"),
    };
    return HebrewCalendar.calendar(calOptions) as TimedEvent[];
  };

  const weeks = () => {
    const firstDayOfMonth = displayDay().date(0).weekday() + 1;
    const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;
    let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
    return [...Array(numWeeks)].map((_) => {
      return [...Array(7)].map((_) => {
        markerDay = markerDay.add(1, "day");
        const date = markerDay;
        const holiday = cal().find((d) =>
          dayjs(d.eventTime).isSame(date, "date")
        );
        return { date, holiday } as CalendarDay;
      });
    });
  };

  const nextCandleLighting = () => {
    const next = findNextEvent(
      cal(),
      "Candle lighting",
      new HDate(displayDay().toDate())
    );
    console.log(next);
    return next;
  };
  const nextHavdalah = () =>
    findNextEvent(
      cal(),
      "Havdalah",
      new HDate(nextCandleLighting().date.toDate())
    );

  // Calendar styling
  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  function chooseWeight(day: CalendarDay) {
    return day.date.isSame(displayDay(), "date") ? "bold" : "normal";
  }

  function chooseBgColour(day: CalendarDay) {
    const regex = /^[^:]*/;
    const holiday = day?.holiday?.desc.match(regex);
    if (!holiday) return "white";
    switch (holiday[0]) {
      case "Candle lighting":
        return "orange";
      case "Havdalah":
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

  function chooseTextColour(day: CalendarDay) {
    return day.date.month() === displayDay().month() ? "inherit" : "gray";
  }

  return (
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
      <p>
        {nextCandleLighting().holiday?.linkedEvent?.desc || "Shabbat"}{" "}
        {nextCandleLighting().date.format("DD/MM/YYYY")}
      </p>
      <p>Candle lighting: {nextCandleLighting().date.format("h:mm A")}</p>
      <p>Havdalah: {nextHavdalah().date.format("h:mm A")}</p>
      <button
        onClick={() => setDisplayDay(dayjs())}
        class="p-2 border w-fit
        bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
      >
        Back to today
      </button>
    </div>
  );
}
