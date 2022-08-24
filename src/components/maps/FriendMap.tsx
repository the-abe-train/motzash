import mapboxgl, { Map } from "mapbox-gl";
import { Component, createEffect, onMount, Setter } from "solid-js";
import { getMapCentre } from "../../util/location";

type Props = {
  friends: FriendStatus[];
  user: MyStatus | null;
  focus: FriendStatus | MyStatus | null;
  setFocus: Setter<FriendStatus | MyStatus | null>;
};

const FriendMap: Component<Props> = (props) => {
  let mapContainer: HTMLDivElement;
  let map: Map;

  onMount(async () => {
    const mapCentre = await getMapCentre(props.user, props.friends);
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [mapCentre.lng, mapCentre.lat], // starting position [lng, lat]
      zoom: 11, // starting zoom
    });

    // User marker
    if (props.user?.location) {
      const marker = new mapboxgl.Marker({
        color: "red",
        draggable: false,
      })
        .setLngLat([props.user.location.lng, props.user.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<p>${props.user?.profiles.username}!</p>`
          )
        )
        .addTo(map);

      // Add click event handler
      marker
        .getElement()
        .addEventListener("click", () => props.setFocus(props.user));
    }

    // Friend markers
    props.friends.forEach((friendStatus) => {
      if (!friendStatus.location) return;
      const marker = new mapboxgl.Marker({
        color: "blue",
        draggable: false,
      })
        .setLngLat([friendStatus.location.lng, friendStatus.location.lat])

        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <b>${friendStatus.profiles.username}</b>
          <p>${friendStatus.text}!</p>
        `)
        )
        .addTo(map);

      // Add click event handler
      marker
        .getElement()
        .addEventListener("click", () => props.setFocus(friendStatus));
    });
  });

  createEffect(() => {
    try {
      if (props.focus?.location) {
        map.flyTo({ center: props.focus.location });
      }
    } catch (error) {
      console.log("Recentering cancelled");
    }
  });

  return <div ref={mapContainer!} class="col-span-6 m-4"></div>;
};

export default FriendMap;
