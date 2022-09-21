import { Component, createSignal, Show } from "solid-js";
import { supabase } from "../util/supabase";

type Props = {
  inWidget: boolean;
};

const Auth: Component<Props> = (props) => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");

  const magicLinkLogin = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email: email() });
      if (error) {
        console.error(error);
        throw error;
      }
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const googleOauthLogin = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error(error);
        throw error;
      }
    } catch (error: any) {
      console.error(error.error_description || error.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 class="font-header text-2xl mb-1">Sign-in form</h1>
      <p>Sign-in/sign-up with your email below</p>
      {loading() ? (
        "Sending magic link..."
      ) : (
        <form
          onSubmit={magicLinkLogin}
          class="flex flex-col space-y-2 py-4 max-w-md"
        >
          <input
            id="email"
            class="px-2 py-1 flex-grow border border-black max-w-md"
            type="email"
            placeholder="Your email"
            maxLength={50}
            required
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <div class="flex justify-around items-center">
            <button
              type="submit"
              disabled={loading()}
              class="p-2 border border-black rounded drop-shadow-small 
              w-fit bg-ghost hover:drop-shadow-none disabled:drop-shadow-none transition-all"
              aria-live="polite"
            >
              Send magic link
            </button>
            <Show when={!props.inWidget}>
              <span>or</span>
            </Show>
            <Show when={props.inWidget}>
              <span class="hidden sm:block md:hidden lg:block">or</span>
            </Show>

            <button
              type="button"
              onClick={googleOauthLogin}
              disabled={loading()}
              class="p-2 border border-black rounded drop-shadow-small
                          w-fit bg-ghost hover:drop-shadow-none disabled:drop-shadow-none transition-all"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
                alt="Google"
                class="inline pb-[2px] mr-1 "
              />
              Sign in with Google
            </button>
          </div>
        </form>
      )}
      <div class="my-4">
        <h2 class="text-xl">Sign in to Motzash to:</h2>
        <ul class="list-disc list-inside">
          <li>Create Shabbat “todo” lists</li>
          <li>Build cookbooks with your favourite recipes for Chag</li>
          <li>Vote on activities, like board games and sports</li>
          <li>
            Update your status to show where you're going to be and what you're
            getting up to
          </li>
          <li>Add friends to your Motzash network</li>
        </ul>
      </div>
    </div>
  );
};

export default Auth;
