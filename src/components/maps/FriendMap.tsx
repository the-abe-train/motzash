import mapboxgl from "mapbox-gl";
import { Component, onMount } from "solid-js";
import { Database } from "../../lib/database.types";
import { latLngMidpoint } from "../../util/geography";
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
    // const markerFriends = props.friends.filter(friend => {
    //   return friend.lat && friend.lng
    // })

    console.log("mounting friend map");

    let lat: number, lng: number;
    const currentLocation = await getLocation();
    if (props.user?.lat && props.user?.lng) {
      console.log("User status marker");
      lat = props.user.lat;
      lng = props.user.lng;
    } else if (currentLocation) {
      console.log("Location from api");
      lat = currentLocation.lat;
      lng = currentLocation.lng;
    } else {
      console.log("Calculated midpoint");
      const friendCoords = props.friends.map(({ lat, lng }) => ({ lat, lng }));
      const midpoint = latLngMidpoint(friendCoords);
      lat = midpoint.lat;
      lng = midpoint.lng;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    if (props.user?.lat && props.user.lng) {
      new mapboxgl.Marker({
        color: "red",
        draggable: false,
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<p>${props.user?.profiles.username}!</p>`
          )
        )
        .addTo(map);
    }

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

  return <div ref={mapContainer!} class="col-span-6 m-4"></div>;
};

export default FriendMap;
