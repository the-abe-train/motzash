export function getLocation(): Promise<Coords | null> {
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
export async function getGeoNameId({ lat, lng }: Coords) {
  const url = new URL("http://api.geonames.org/findNearbyPlaceNameJSON");
  const queryParams = {
    lat: lat.toString(),
    lng: lng.toString(),
    cities: "cities15000",
    username: "theabetrain",
  };
  url.search = new URLSearchParams(queryParams).toString();
  const geoData = await fetch(url).then((data) => data.json());
  const { name, adminName1 } = geoData.geonames[0];
  return `${name}, ${adminName1}`;
}

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad / Math.PI) * 180;

export function latLngMidpoint(coords: Coords[]) {
  // Make sure there are no nulls
  const realCoords = coords.filter((set) => {
    return set.lat && set.lng;
  }) as Coords[];

  console.log("Real coords", realCoords);

  // Convert lat/lng (must be in radians) to Cartesian coordinates for each location.
  const cartesians = realCoords.map(({ lat, lng }) => {
    const radLat = degToRad(lat);
    const radLng = degToRad(lng);
    return {
      x: Math.cos(radLat) * Math.cos(radLng),
      y: Math.cos(radLat) * Math.sin(radLng),
      z: Math.sin(radLat),
    };
  });

  console.log("Cartesians", cartesians);

  // Compute average x, y and z coordinates.
  const avg = cartesians.reduce(
    (prev, curr) => {
      return {
        x: prev.x + curr.x / coords.length,
        y: prev.y + curr.y / coords.length,
        z: prev.z + curr.z / coords.length,
      };
    },
    { x: 0, y: 0, z: 0 }
  );

  console.log("Average point", avg);

  // Convert average x, y, z coordinate to latitude and longitude.
  const hyp = Math.sqrt(avg.x ** 2 + avg.y ** 2);
  const resultRad = {
    lat: Math.atan2(avg.z, hyp),
    lng: Math.atan2(avg.y, avg.x),
  };
  const output = { lat: radToDeg(resultRad.lat), lng: radToDeg(resultRad.lng) };
  console.log("output", output);

  return output;
}

// async function getShabbosTimes(geonameId: string) {
//   const url = new URL("https://www.hebcal.com/shabbat");
//   const queryParams = {
//     cfg: "json",
//     geonameId,
//   };
//   url.search = new URLSearchParams(queryParams).toString();
//   const shabbosData = await fetch(url).then((data) => data.json());
//   const candleLighting = shabbosData.items.find(
//     (item: any) => item.title_orig === "Candle lighting"
//   ).title;
//   const havdalah = shabbosData.items.find(
//     (item: any) => item.title_orig === "Havdalah"
//   ).title;
//   return { candleLighting, havdalah };
// }
