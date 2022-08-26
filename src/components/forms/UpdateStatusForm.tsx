import {
  Component,
  createEffect,
  createSignal,
  Resource,
  Setter,
} from "solid-js";
import { createStore } from "solid-js/store";
import { getCity, getLocation } from "../../util/location";
import { supabase } from "../../util/supabase";
import StatusMap from "../maps/StatusMap";

// TODO Reintroduce tags, which should be defined by database

type Props = {
  myStatus: Resource<MyStatus | null | undefined>;
  setShowScreen: Setter<ScreenName>;
  myStatusRefetch: () => any | Promise<any> | undefined | null;
};

const UpdateStatusForm: Component<Props> = (props) => {
  const [newStatus, setNewStatus] = createStore<Status>({
    text: "",
    location: null,
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

  const [loading, setLoading] = createSignal(false);
  const [msg, setMsg] = createSignal("");
  async function updateLocation() {
    setLoading(true);
    setMsg("");
    try {
      const coords = await getLocation();
      if (!coords) {
        setMsg("Enable geolocation API to use automatic location detection.");
        return;
      }
      const city = await getCity(coords);
      console.log(city);
      setNewStatus("location", coords);
      setNewStatus("city", city);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const [loading2, setLoading2] = createSignal(false);
  const upsertStatus = async (e: Event) => {
    e.preventDefault();
    setLoading2(true);
    const user = await supabase.auth.getUser();
    const user_id = user.data.user?.id || "";
    const updates = { ...newStatus, user_id };
    const { data, error } = await supabase.from("statuses").upsert(updates, {
      onConflict: "user_id",
    });
    if (error) {
      console.error(error);
      setLoading2(false);
      return;
    }
    setLoading2(false);
    props.myStatusRefetch();
    props.setShowScreen("Map");
  };

  const deleteStatus = async (e: Event) => {
    e.preventDefault();
    setLoading2(true);
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
    setLoading2(false);
    props.myStatusRefetch();
    props.setShowScreen("Map");
  };

  return (
    <form
      onSubmit={upsertStatus}
      class="col-span-7 flex flex-col space-y-4 p-4 relative"
    >
      <button
        class="absolute top-2 right-2 w-fit px-2  border rounded
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
          required
          onChange={(e) => setNewStatus("text", e.currentTarget.value)}
        />
      </div>
      <button
        class="w-fit p-2  border rounded
          bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
        onClick={updateLocation}
        type="button"
        disabled={loading()}
      >
        Get GPS location
      </button>
      <div class="flex space-x-4">
        <label for="city">City/town:</label>
        <input
          name="city"
          class="border px-2"
          type="text"
          value={newStatus.city || ""}
          onChange={(e) => setNewStatus("city", e.currentTarget.value)}
        />
      </div>
      <p>{msg}</p>
      <p>Drag the marker below to show where you're going to be on Shabbat!</p>
      <StatusMap newStatus={newStatus} setNewStatus={setNewStatus} />
      <div class="flex space-x-4">
        <button
          type="submit"
          class="w-fit p-2  border rounded
    bg-slate-200 hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          disabled={loading2()}
        >
          Update status
        </button>
        <button
          class="w-fit p-2  border rounded
          hover:bg-slate-300 active:bg-slate-400 disabled:bg-slate-400"
          onClick={deleteStatus}
          disabled={loading2()}
        >
          Delete status
        </button>
      </div>
    </form>
  );
};

export default UpdateStatusForm;
