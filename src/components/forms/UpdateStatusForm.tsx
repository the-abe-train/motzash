import {
  Component,
  createEffect,
  createSignal,
  Setter,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import Filter from "bad-words";
import { AuthContext } from "../../context/auth2";
import { useHavdalah } from "../../context/havdalah";
import { getCity, getLocation } from "../../util/location";
import { supabase } from "../../util/supabase";
import StatusMap from "../maps/StatusMap";

type Props = {
  myStatus: FriendStatus | null;
  setShowScreen: Setter<ScreenName>;
  refetch: () => any | Promise<any> | undefined | null;
};

const UpdateStatusForm: Component<Props> = (props) => {
  const user = useContext(AuthContext);
  const user_id = user?.id;
  const getHavdalah = useHavdalah();
  const [newStatus, setNewStatus] = createStore<Status>({
    user_id,
    text: "",
    location: null,
    city: "",
  });

  // Start off with defaults
  createEffect(() => {
    const returnedValue = props.myStatus;
    if (returnedValue) {
      const { id, profiles, ...newStatus } = returnedValue;
      setNewStatus(newStatus);
    }
  });

  const [loading, setLoading] = createSignal(false);
  const [loading2, setLoading2] = createSignal(false);
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
      setNewStatus("location", coords);
      setNewStatus("city", city);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  const upsertStatus = async (e: Event) => {
    e.preventDefault();
    setLoading2(true);
    setMsg("");
    if (!user_id) return;
    const filter = new Filter();
    if (filter.isProfane(newStatus?.city || "")) {
      setMsg("Please remove the profanity from the city name.");
      setLoading2(false);
      return;
    }
    if (filter.isProfane(newStatus?.text || "")) {
      setMsg("Please remove the profanity from your status.");
      setLoading2(false);
      return;
    }

    const havdalah = await getHavdalah();
    const updates = { ...newStatus, user_id, havdalah };
    const { data, error } = await supabase.from("statuses").upsert(updates, {
      onConflict: "user_id",
    });
    if (error) {
      console.error(error);
      setLoading2(false);
      return;
    }
    setLoading2(false);
    props.refetch();
    props.setShowScreen("Map");
  };

  const deleteStatus = async (e: Event) => {
    e.preventDefault();
    setLoading2(true);
    const { count, error } = await supabase
      .from("statuses")
      .delete()
      .eq("user_id", user_id || "");
    if (error) console.error(error);
    setLoading2(false);
    props.refetch();
    props.setShowScreen("Map");
  };

  return (
    <form
      onSubmit={upsertStatus}
      class="col-span-6 lg:col-span-8 flex flex-col space-y-4 p-4 relative pt-8"
    >
      <button
        class="absolute top-2 right-2 w-fit px-2 border border-black rounded
      bg-coral drop-shadow-small hover:drop-shadow-none transition-all"
        onClick={() => props.setShowScreen(() => "Map")}
      >
        Back to map
      </button>
      <div class="flex flex-col lg:flex-row lg:space-x-5">
        <div class="flex flex-col space-y-2">
          <label for="text">What are you up to on Shabbat?</label>
          <input
            type="text"
            name="text"
            class="border border-black w-full md:w-80 px-2"
            value={newStatus.text || ""}
            required
            onChange={(e) => setNewStatus("text", e.currentTarget.value)}
          />
        </div>
        <div class="flex flex-col space-y-2">
          <label for="city">Where are you going to be on Shabbat?</label>
          <input
            name="city"
            class="border border-black w-full md:w-80 px-2"
            type="text"
            value={newStatus.city || ""}
            required
            onChange={(e) => setNewStatus("city", e.currentTarget.value)}
          />
          <button
            class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
                    bg-blue hover:drop-shadow-none transition-all"
            onClick={updateLocation}
            type="button"
            disabled={loading()}
          >
            Get GPS location
          </button>
        </div>
      </div>
      <p>{msg}</p>
      <p>Drag the marker below to show where you're going to be on Shabbat!</p>
      <StatusMap newStatus={newStatus} setNewStatus={setNewStatus} />
      <div class="flex space-x-4">
        <button
          type="submit"
          class="px-2 py-1 w-fit border border-black rounded drop-shadow-small 
          bg-blue hover:drop-shadow-none disabled:drop-shadow-none transition-all"
          disabled={loading2()}
        >
          Update status
        </button>
        <button
          type="button"
          class="px-2 py-1 w-fit text-coral2 border border-coral2 rounded drop-shadow-small 
                bg-yellow2 hover:drop-shadow-none disabled:drop-shadow-none  transition-all"
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
