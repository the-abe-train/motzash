function getLocation() {
  return new Promise((res, rej) => {
    if ("geolocation" in navigator) {
      console.log("Geolocation is available");
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        res({ latitude, longitude });
      });
    } else {
      console.log("Geolocation is not available");
      rej();
    }
  });
}

async function getGeoNameId({ lat, lng }: { lat: string; lng: string }) {
  const url = new URL("http://api.geonames.org/findNearbyPlaceNameJSON");
  const queryParams = {
    lat,
    lng,
    cities: "cities5000", // Pulls nearest city with pop over 5000
    username: "theabetrain",
  };
  url.search = new URLSearchParams(queryParams).toString();
  const geoData = await fetch(url).then((data) => data.json());
  const { geonameId } = geoData.geonames[0];
  return geonameId;
}

async function getShabbosTimes(geonameId: string) {
  const url = new URL("https://www.hebcal.com/shabbat");
  const queryParams = {
    cfg: "json",
    geonameId,
  };
  url.search = new URLSearchParams(queryParams).toString();
  const shabbosData = await fetch(url).then((data) => data.json());
  console.log(shabbosData);
  const candleLighting = shabbosData.items.find(
    (item: any) => item.title_orig === "Candle lighting"
  ).title;
  const havdalah = shabbosData.items.find(
    (item: any) => item.title_orig === "Havdalah"
  ).title;
  return { candleLighting, havdalah };
}
