import { For } from "solid-js";
import {
  CalOptions,
  Location,
  flags,
  HebrewCalendar,
  TimedEvent,
} from "@hebcal/core";
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
  const displayDay = dayjs();
  const year = displayDay.year();
  const month = displayDay.month();
  const firstDayOfMonth = displayDay.date(0).weekday() + 1;
  const daysInMonth = displayDay.daysInMonth();

  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];
  const calOptions: CalOptions = {
    year,
    month: month + 1,
    isHebrewYear: false,
    candlelighting: true,
    location: Location.lookup("Toronto"),
    // mask: flags.LIGHT_CANDLES,
  };

  const cal = HebrewCalendar.calendar(calOptions) as TimedEvent[];
  console.log(cal);

  // Not sure why this is always a day short but need to add 1
  let day = 0;
  const weeks = [...Array(6)].map((_) => {
    return [...Array(7)].map((_, dayOfWeek) => {
      if (day === 0 && dayOfWeek < firstDayOfMonth) return "";
      if (day >= daysInMonth) return "";
      day++;
      const date = dayjs({ year, month, day });
      const holiday = cal.find((d) => dayjs(d.eventTime).isSame(date, "date"));
      return { date, holiday } as CalendarDay;
    });
  });
  console.log(weeks);

  function chooseWeight(day: CalendarDay) {
    return day.date.isSame(dayjs(), "date") ? "bold" : "normal";
  }

  function chooseBgColour(day: CalendarDay) {
    switch (day?.holiday?.desc) {
      case "Candle lighting":
        return "orange";
      case "Havdalah":
        return "yellow";
      case "Fast begins":
        return "lightgreen";
      case "Fast ends":
        return "lightblue";
      default:
        return "inherit";
    }
  }

  // TODO days from prev and next month in a lighter weight
  // TODO 6th row only when needed

  return (
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
        <For each={weeks}>
          {(week) => {
            return (
              <tr class="border">
                <For each={week}>
                  {(day) => {
                    if (day === "") return <td></td>;
                    return (
                      <td
                        style={{
                          "font-weight": chooseWeight(day),
                          "background-color": chooseBgColour(day),
                        }}
                        class="text-center"
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
  );
}
