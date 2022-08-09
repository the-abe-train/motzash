import { For } from "solid-js";
import { CalOptions, Location, flags, HebrewCalendar } from "@hebcal/core";
import dayjs from "dayjs";
import calendarPlugin from "dayjs/plugin/calendar";
import weekdayPlugin from "dayjs/plugin/weekday";
dayjs.extend(calendarPlugin);
dayjs.extend(weekdayPlugin);

export default function Calendar() {
  const dayHeaders = ["S", "M", "T", "W", "T", "F", "S"];
  const calOptions: CalOptions = {
    year: dayjs().year(),
    month: dayjs().month(),
    isHebrewYear: false,
    candlelighting: true,
    location: Location.lookup("Toronto"),
    // mask: flags.LIGHT_CANDLES,
  };

  const cal = HebrewCalendar.calendar(calOptions);

  // Secular calendar
  // console.log(dayjs().calendar(dayjs()));
  // const weeks = [...Array(5)];
  // const days = [...Array(7)];
  // Not sure why this is always a day short but need to add 1
  const firstDayOfMonth = dayjs("2022-08-06").date(0).weekday() + 1;
  let i = 0;
  const weeks = [...Array(5)].map((_) => {
    return [...Array(7)].map((_, dayOfWeek) => {
      if (i === 0 && dayOfWeek < firstDayOfMonth) {
        return "";
      } else if (i < dayjs().daysInMonth()) {
        i++;
        return i;
      }
      return "";
    });
  });

  return (
    <table class="w-full p-2">
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
              <tr>
                <For each={week}>
                  {(day) => {
                    return (
                      <td
                        style={{
                          color: day === dayjs().date() ? "red" : "black",
                        }}
                      >
                        {day}
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
