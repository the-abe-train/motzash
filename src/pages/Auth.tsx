import { Component, createSignal } from "solid-js";
import { supabase } from "../util/supabase";
import "../styles/google.css";

const Auth: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");

  const magicLinkLogin = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("email", email());
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
    <div class="col-span-6 lg:col-span-4">
      <h1 class="font-header text-xl mb-1">Sign-in form</h1>
      <p>Sign in via magic link with your email below</p>
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
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="p-2 border border-black rounded drop-shadow-small 
            w-fit mx-auto
             bg-ghost hover:drop-shadow-none transition-all"
            aria-live="polite"
          >
            Send magic link
          </button>
        </form>
      )}

      <button
        type="button"
        class="login-with-google-btn"
        onClick={googleOauthLogin}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;
