import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  try {
    const { lat, lng } = JSON.parse(event.body || "{}");
    const url = new URL("http://api.geonames.org/findNearbyPlaceNameJSON");

    // cities1000 means all cities with a population of over 1000
    // 500, 1000, 5000, 15000 are all options
    const queryParams = {
      lat,
      lng,
      cities: "cities15000",
      username: process.env.GEONAMES_USERNAME || "",
    };
    url.search = new URLSearchParams(queryParams).toString();
    const geoname = (await fetch(url).then((data) => data.json())) as Geodata;
    const { name, adminName1 } = geoname.geonames[0];
    return {
      statusCode: 200,
      body: JSON.stringify({ city: `${name}, ${adminName1}` }),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", details: e }),
    };
  }
};

export { handler };
