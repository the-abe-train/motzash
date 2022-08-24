import mapboxgl from "mapbox-gl";
import type { EventData } from "mapbox-gl";
import { Component, onMount } from "solid-js";
import { getGeoNameId, getLocation } from "../../util/location";
import { SetStoreFunction } from "solid-js/store";

type Props = {
  newStatus: Status;
  setNewStatus: SetStoreFunction<Status>;
};

const FriendMap: Component<Props> = (props) => {
  let mapContainer: HTMLDivElement;
  // const [newCoords, setNewCoords] = createSignal<Coords | null>(null);

  onMount(async () => {
    console.log("Mounting map");
    let location: Coords | null = null;
    const currentLocation = await getLocation();
    const myLocation = props.newStatus?.location;
    if (myLocation) {
      location = myLocation;
    } else if (currentLocation) {
      location = currentLocation;
    } else {
      location = { lat: 43.6, lng: -79.4 };
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [location.lng, location.lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    new mapboxgl.Marker({
      color: "red",
      draggable: true,
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map)
      .on("dragend", async (e: EventData) => {
        const location = e.target._lngLat;
        const city = await getGeoNameId(location);
        props.setNewStatus("location", location);
        props.setNewStatus("city", city);
      });
  });

  return <div ref={mapContainer!} class="my-4 w-full h-80"></div>;
};

export default FriendMap;
