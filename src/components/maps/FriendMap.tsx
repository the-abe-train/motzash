import mapboxgl from "mapbox-gl";
import { Component, onMount } from "solid-js";
import { Database } from "../../lib/database.types";
import { getLocation, latLngMidpoint } from "../../util/location";

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

    let location: Coords | null = null;
    const currentLocation = await getLocation();
    if (props.user?.location) {
      console.log("User status marker");
      location = props.user.location;
    } else if (currentLocation) {
      console.log("Location from api");
      location = currentLocation;
    } else {
      console.log("Calculated midpoint");
      const friendCoords = props.friends
        .map(({ location }) => location)
        .filter((c) => !!c) as Coords[];
      const midpoint = latLngMidpoint(friendCoords);
      location = midpoint;
    }

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [location.lng, location.lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    if (props.user?.location) {
      new mapboxgl.Marker({
        color: "red",
        draggable: false,
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<p>${props.user?.profiles.username}!</p>`
          )
        )
        .addTo(map);
    }

    // Friend markers
    // TODO bind markers to focused friend
    props.friends.forEach(({ location, profiles, text }) => {
      if (!location) return;
      new mapboxgl.Marker({
        color: "blue",
        draggable: false,
      })
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <b>${profiles.username}</b>
          <p>${text}!</p>
        `)
        )
        .addTo(map);
    });
  });

  return <div ref={mapContainer!} class="col-span-6 m-4"></div>;
};

export default FriendMap;
