import holidayMapRaw from "../assets/data/holiday_map.json";
import colourMapRaw from "../assets/data/colour_map.json";

const holidayMap = holidayMapRaw as Record<string, HolidayCategory>;
const colourMap = colourMapRaw as Record<HolidayCategory, string>;

function getHoliday(day: CalendarDay) {
  if (!day.holidays || day.holidays.length === 0) return "none";
  if (day.date.day() === 6) return "shabbat";
  // const regex = /^[^:]*/;

  const { desc } = day.holidays[0];

  let holiday = holidayMap[desc];
  if (!holiday) {
    if (desc.includes("Rosh Hashana")) return "yontif";
    if (desc.includes("Shabbat")) return "shabbat";
    if (desc.includes("Rosh Chodesh")) return "rosh_chodesh";
  }
  return holiday;
}

export function getColour(day: CalendarDay) {
  const holiday = getHoliday(day);
  const colour = colourMap[holiday];
  return colour;
}
