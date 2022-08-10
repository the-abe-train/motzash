import { createEffect, createSignal, For } from "solid-js";
import { CalOptions, Location, HebrewCalendar, TimedEvent } from "@hebcal/core";
import dayjs, { Dayjs } from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
import objectSupport from "dayjs/plugin/objectSupport";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);
dayjs.extend(objectSupport);

type CalendarDay = {
  date: Dayjs;
  holiday?: TimedEvent;
};

export default function Calendar() {
  // Setup
  const [displayDay, setDisplayDay] = createSignal(dayjs());

  createEffect(() => {
    console.log(displayDay());
  });

  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];

  // Let's make 'weeks' into a derived signal
  const weeks = () => {
    const year = displayDay().year();
    const month = displayDay().month();
    const firstDayOfMonth = displayDay().date(0).weekday() + 1;
    const numWeeks = firstDayOfMonth <= 4 ? 5 : 6;

    const calOptions: CalOptions = {
      year,
      month: month + 1,
      isHebrewYear: false,
      candlelighting: true,
      location: Location.lookup("Toronto"),
    };

    const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];

    let markerDay = displayDay().date(0).subtract(firstDayOfMonth, "days");
    // console.log(markerDay.toString());
    return [...Array(numWeeks)].map((_) => {
      return [...Array(7)].map((_) => {
        markerDay = markerDay.add(1, "day");
        const date = markerDay;
        const holiday = cal.find((d) =>
          dayjs(d.eventTime).isSame(date, "date")
        );
        return { date, holiday } as CalendarDay;
      });
    });
  };

  function chooseWeight(day: CalendarDay) {
    return day.date.isSame(displayDay(), "date") ? "bold" : "normal";
  }

  function chooseBgColour(day: CalendarDay) {
    const regex = /^[^:]*/;
    const holiday = day?.holiday?.desc.match(regex);
    if (!holiday) return "inherit";
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
        return "inherit";
    }
  }

  function chooseTextColour(day: CalendarDay) {
    return day.date.month() === displayDay().month() ? "inherit" : "gray";
  }

  return (
    <>
      <h2 class="text-center">{displayDay().format("MMMM YYYY")}</h2>
      <table class="w-full p-2">
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
                return <th>{day}</th>;
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
    </>
  );
}
