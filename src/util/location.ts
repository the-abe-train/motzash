type Coordinates = { lat: number; lng: number };

export function getLocation(): Promise<Coordinates | null> {
  return new Promise((res, rej) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          res({ lat, lng });
        },
        (error) => {
          console.error(error);
          res(null);
        }
      );
    } else {
      res(null);
    }
  });
}

// cities1000 means all cities with a population of over 1000
// 500, 1000, 5000, 15000 are all options
export async function getGeoNameId({ lat, lng }: Coordinates) {
  const url = new URL("http://api.geonames.org/findNearbyPlaceNameJSON");
  const queryParams = {
    lat: lat.toString(),
    lng: lng.toString(),
    cities: "cities15000",
    username: "theabetrain",
  };
  url.search = new URLSearchParams(queryParams).toString();
  const geoData = await fetch(url).then((data) => data.json());
  const { name, adminName1, countryName } = geoData.geonames[0];
  return `${name}, ${adminName1}, ${countryName}`;
}

async function getShabbosTimes(geonameId: string) {
  const url = new URL("https://www.hebcal.com/shabbat");
  const queryParams = {
    cfg: "json",
    geonameId,
  };
  url.search = new URLSearchParams(queryParams).toString();
  const shabbosData = await fetch(url).then((data) => data.json());
  const candleLighting = shabbosData.items.find(
    (item: any) => item.title_orig === "Candle lighting"
  ).title;
  const havdalah = shabbosData.items.find(
    (item: any) => item.title_orig === "Havdalah"
  ).title;
  return { candleLighting, havdalah };
}
