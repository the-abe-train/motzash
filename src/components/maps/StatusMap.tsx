import mapboxgl from "mapbox-gl";
import { Component, onMount } from "solid-js";
import { Database } from "../../lib/database.types";
import { getLocation } from "../../util/location";

type Status = Database["public"]["Tables"]["statuses"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type Props = {
  friends: (Status & { profiles: Profile })[];
  user?: Status & { profiles: Profile };
};

const FriendMap: Component<Props> = (props) => {
  let mapContainer: HTMLDivElement;

  onMount(async () => {
    let lat: number, lng: number;
    if (props.user?.lat && props.user?.lng) {
      lat = props.user.lat;
      lng = props.user.lng;
    } else {
      const currentLocation = await getLocation();
      lat = currentLocation.lat;
      lng = currentLocation.lng;
    }
    // TODO add another "else" for when no location allowed.
    // TODO there shouldn't be a marker if no use status, just a centered map

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    new mapboxgl.Marker({
      color: "red",
      draggable: false,
    })
      .setLngLat([lng, lat])
      .setPopup(
        // new mapboxgl.Popup().setHTML(`<p>${props.user.profiles.username}!</p>`)
        new mapboxgl.Popup().setHTML(`<p>${props.user?.profiles.username}!</p>`)
      )
      .addTo(map);

    // Friend markers
    // TODO bind markers to focused friend
    props.friends.forEach(({ lat, lng, profiles }) => {
      if (!lat || !lng) return;
      new mapboxgl.Marker({
        color: "blue",
        draggable: false,
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<p>${profiles.username}!</p>`))
        .addTo(map);
    });
  });

  return <div ref={mapContainer!} class="col-span-8 m-4"></div>;
};

export default FriendMap;
