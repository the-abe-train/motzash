import mapboxgl, { Marker } from "mapbox-gl";
import type { EventData } from "mapbox-gl";
import { Component, createEffect, onMount } from "solid-js";
import { getCity, getMapCentre } from "../../util/location";
import { SetStoreFunction } from "solid-js/store";

type Props = {
  newStatus: Status;
  setNewStatus: SetStoreFunction<Status>;
};

const FriendMap: Component<Props> = (props) => {
  let mapContainer: HTMLDivElement;
  let marker: Marker;

  onMount(async () => {
    const mapCentre = await getMapCentre(props.newStatus);

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [mapCentre.lng, mapCentre.lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    marker = new mapboxgl.Marker({
      color: "red",
      draggable: true,
    })
      .setLngLat([mapCentre.lng, mapCentre.lat])
      .addTo(map)
      .on("dragend", async (e: EventData) => {
        const location = e.target._lngLat;
        const city = await getCity(location);
        props.setNewStatus("location", location);
        props.setNewStatus("city", city);
      });
  });

  createEffect(() => {
    try {
      if (props.newStatus.location) {
        const { lat, lng } = props.newStatus.location;
        marker.setLngLat([lng, lat]);
      }
    } catch (e) {
      console.log("Pin moving cancelled");
    }
  });

  return (
    <div
      ref={mapContainer!}
      class="col-span-6 lg:col-span-8 my-4 h-80 md:h-full min-h-[20rem]
      p-6 drop-shadow-small border-2 border-black"
    />
  );
};

export default FriendMap;
