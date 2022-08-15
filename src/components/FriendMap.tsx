import mapboxgl from "mapbox-gl";
import { Component, onMount } from "solid-js";

type Props = {
  statuses: Status[];
};

const FriendMap: Component<Props> = ({ statuses }) => {
  let mapContainer: HTMLDivElement;

  onMount(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [-79.43, 43.74], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // Set marker options.
    // TODO bind markers to focused friend
    statuses.forEach(({ name, location }) => {
      new mapboxgl.Marker({
        color: "blue",
        draggable: false,
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<p>${name}!</p>`))
        .addTo(map);
    });
  });

  return <div ref={mapContainer!} class="col-span-8 m-4"></div>;
};

export default FriendMap;
