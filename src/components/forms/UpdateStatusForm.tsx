import { Component, createEffect, Resource, Setter } from "solid-js";
import { createStore } from "solid-js/store";
import { Properties } from "solid-js/web";
import { getGeoNameId, getLocation } from "../../util/location";
import { supabase } from "../../util/supabase";

type Status = {
  text: string | null;
  tags: string[] | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
};

type Props = {
  myStatus: Resource<any>;
  setShowScreen: Setter<ScreenName>;
};

const UpdateStatusForm: Component<Props> = (props) => {
  const [newStatus, setNewStatus] = createStore<Status>({
    text: "",
    tags: [""],
    lat: null,
    lng: null,
    city: "",
  });

  // Start off with defaults
  createEffect(() => {
    const returnedValue = props.myStatus();
    if (returnedValue) {
      const { id, profiles, ...newStatus } = returnedValue;
      setNewStatus(newStatus);
    }
  });

  const upsertStatus = async (e: Event) => {
    e.preventDefault();
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const updates = { ...newStatus, user_id };
    await supabase.from("statuses").upsert(updates, {
      onConflict: "user_id",
    });
  };

  const deleteStatus = async (e: Event) => {
    e.preventDefault();
    console.log("Deleting status");
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;
    console.log(userId);
    const { count, error } = await supabase
      .from("statuses")
      .delete()
      .eq("user_id", userId || "");
    console.log(count, "rows deleted.");
    if (error) console.error(error);
  };

  const selectTags = (e: Event & { currentTarget: HTMLSelectElement }) => {
    const options = e.currentTarget.selectedOptions;
    const numTags = options.length;
    const values: string[] = [];
    for (let i = 0; i < numTags; i++) {
      const option = options.item(i);
      if (option?.value) values.push(option?.value);
    }
    setNewStatus("tags", values);
  };

  async function updateLocation() {
    const { lat, lng } = await getLocation();
    const city = await getGeoNameId(lat, lng);
    setNewStatus("lat", lat);
    setNewStatus("lng", lng);
    setNewStatus("city", city);
  }

  return (
    <form
      onSubmit={upsertStatus}
      class="col-span-7 flex flex-col space-y-4 p-4 relative"
    >
      <button
        class="absolute top-2 right-2
      w-fit px-2  border rounded
      bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        onClick={() => props.setShowScreen(() => "Map")}
      >
        X
      </button>
      <div class="flex flex-col space-y-2">
        <label for="text">What are you up to on Shabbos?</label>
        <input
          type="text"
          name="text"
          class="border w-1/2 px-2"
          value={newStatus.text || ""}
          onChange={(e) => setNewStatus("text", e.currentTarget.value)}
        />
      </div>
      <div class="flex flex-col space-y-2">
        <label for="cars">Choose up to 4 tags:</label>
        <select multiple name="cars" class="w-96 border" onChange={selectTags}>
          <option value="board games">Board games</option>
          <option value="basketball">Basketball</option>
          <option value="Shaleshudes">Shaleshudes</option>
          <option value="chulent">Chulent</option>
        </select>
      </div>
      <div class="flex space-x-4">
        <button
          class="w-fit p-2  border rounded
    bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
          onClick={updateLocation}
          type="button"
        >
          Get location
        </button>
        <input
          class="border px-2"
          type="text"
          value={newStatus.city || ""}
          onChange={(e) => setNewStatus("city", e.currentTarget.value)}
        />
      </div>
      <div class="flex space-x-4">
        <button
          type="submit"
          class="w-fit p-2  border rounded
    bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
        >
          Update status
        </button>
        <button
          class="w-fit p-2  border rounded
     hover:bg-slate-300 active:bg-slate-400"
          onClick={deleteStatus}
        >
          Delete status
        </button>
      </div>
    </form>
  );
};

export default UpdateStatusForm;