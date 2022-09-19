import holidayMapRaw from "../assets/data/holiday_map.json";
import colourMapRaw from "../assets/data/colour_map.json";

const holidayMap = holidayMapRaw as Record<string, HolidayCategory>;
const colourMap = colourMapRaw as Record<HolidayCategory, string>;

function getCategory(desc: string) {
  const category = holidayMap[desc];
  if (!category) {
    if (desc.includes("Rosh Hashana")) return "yontif";
    if (desc.includes("Shabbat")) return "shabbat";
    if (desc.includes("Rosh Chodesh")) return "rosh_chodesh";
  }
  return category;
}

export function getHoliday(day: CalendarDay) {
  if (!day.holidays || day.holidays.length === 0)
    return { category: "none" as HolidayCategory };
  if (day.date.day() === 6) return { category: "shabbat" as HolidayCategory };

  const importanceOrder = Object.keys(colourMap) as HolidayCategory[];

  const category = day.holidays.reduce((output, holiday) => {
    const desc = holiday.desc;
    const newCategory = getCategory(desc);

    const newIdx = importanceOrder.indexOf(newCategory);
    const oldIdx = importanceOrder.indexOf(output);
    return newIdx < oldIdx ? newCategory : output;
  }, "none" as HolidayCategory);

  const holiday = day.holidays.find((h) => {
    return getCategory(h.desc) === category;
  });

  return { holiday, category };
}

export function getColour(day: CalendarDay) {
  const holiday = getHoliday(day);
  const colour = colourMap[holiday.category];
  console.log(day, holiday, colour);
  return colour;
}
