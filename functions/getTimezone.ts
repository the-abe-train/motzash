import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
  try {
    const { lat, lng } = JSON.parse(event.body || "{}");
    const url = new URL("http://api.geonames.org/timezoneJSON");
    const queryParams = {
      lat,
      lng,
      username: process.env.GEONAMES_USERNAME || "",
    };
    url.search = new URLSearchParams(queryParams).toString();
    const timezone = (await fetch(url).then((data) => data.json())) as Timezone;
    return {
      statusCode: 200,
      body: JSON.stringify(timezone),
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
