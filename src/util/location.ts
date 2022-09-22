import { Location } from "@hebcal/core";

export function getLocation(): Promise<Coords | null> {
  return new Promise((res) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(3));
          const lng = parseFloat(position.coords.longitude.toFixed(3));
          res({ lat, lng });
        },
        (error) => {
          if (error.PERMISSION_DENIED) alert("Location sharing was denied.");
          console.error(error);
          res(null);
        }
      );
    } else {
      res(null);
    }
  });
}

export async function getHebcalLocation() {
  try {
    const coords = await getLocation();
    if (!coords) return null;
    const res = await fetch("/api/getTimezone", {
      method: "POST",
      body: JSON.stringify(coords),
    });
    const tz = (await res.json()) as Timezone;
    const isIsrael = tz.countryCode === "IL";
    const tzid = tz.timezoneId;
    const location = new Location(coords.lat, coords.lng, isIsrael, tzid);
    return location;
  } catch (e) {
    console.log("Error occurred while create Location.");
    console.error(e);
    return null;
  }
}

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad / Math.PI) * 180;

export function latLngMidpoint(coords: Coords[]) {
  // Make sure there are no nulls
  const realCoords = coords.filter((set) => {
    return set.lat && set.lng;
  }) as Coords[];

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

  // Convert average x, y, z coordinate to latitude and longitude.
  const hyp = Math.sqrt(avg.x ** 2 + avg.y ** 2);
  const resultRad = {
    lat: Math.atan2(avg.z, hyp),
    lng: Math.atan2(avg.y, avg.x),
  };
  const output = { lat: radToDeg(resultRad.lat), lng: radToDeg(resultRad.lng) };

  return output;
}

export async function getMapCentre(
  user: MyStatus | Status | null,
  friends?: FriendStatus[]
) {
  let mapCentre = user?.location;
  if (!mapCentre) {
    const currentLocation = await getLocation();
    if (currentLocation) {
      mapCentre = currentLocation;
    } else if (friends) {
      const friendCoords = friends
        .map(({ location }) => location)
        .filter((c) => !!c) as Coords[];
      const midpoint = latLngMidpoint(friendCoords);
      mapCentre = midpoint;
    } else {
      mapCentre = { lat: 43.6, lng: -79.4 };
    }
  }
  return mapCentre;
}
