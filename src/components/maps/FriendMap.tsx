import mapboxgl, { Map, Marker } from "mapbox-gl";
import { Component, createEffect, onMount, Setter } from "solid-js";
import { getMapCentre } from "../../util/location";

type Props = {
  friends: FriendStatus[];
  user: FriendStatus | null;
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
        color: "#A80016",
        draggable: false,
      })
        .setLngLat([props.user.location.lng, props.user.location.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `
          <b>${props.user?.profiles.username}</b>
          <p>${props.user?.text}!</p>
        `
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

      const popup = new mapboxgl.Popup().setHTML(
        `
      <b>${friendStatus.profiles.username}</b>
      <p>${friendStatus.text}!</p>
    `
      );

      const marker = new mapboxgl.Marker({
        color: "#00668F",
        draggable: false,
      })
        .setLngLat([friendStatus.location.lng, friendStatus.location.lat])
        .setPopup(popup)
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

  return (
    <div class="md:h-[35rem] col-span-6 lg:col-span-8 relative">
      <div
        ref={mapContainer!}
        class="h-80 md:h-auto md:absolute top-0 bottom-0 left-0 right-0 my-4
        border-2 border-black"
      />
    </div>
  );
};

export default FriendMap;
