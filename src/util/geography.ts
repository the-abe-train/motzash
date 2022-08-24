type Coords = {
  lat: number | null;
  lng: number | null;
};

type RealCoords = {
  lat: number;
  lng: number;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad / Math.PI) * 180;

export function latLngMidpoint(coords: Coords[]) {
  const realCoords = coords.filter((set) => {
    return set.lat && set.lng;
  }) as RealCoords[];

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
