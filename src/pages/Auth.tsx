// import { ApiError } from "@supabase/supabase-js";
import { Component, createSignal } from "solid-js";
import { supabase } from "../util/supabase";

const Auth: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");

  const handleLogin = async (e: Event) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email: email() });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main class="flex-grow p-4">
      <h1 class="text-xl">Sign-in form</h1>
      <p>Sign in via magic link with your email below</p>
      {loading() ? (
        "Sending magic link..."
      ) : (
        <form onSubmit={handleLogin} class="flex flex-col space-y-2 p-4">
          <label for="email">Email</label>
          <input
            id="email"
            class="border w-1/2"
            type="email"
            placeholder="Your email"
            value={email()}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <button
            type="submit"
            class="w-fit p-2  border rounded
              bg-slate-200 hover:bg-slate-300 active:bg-slate-400"
            aria-live="polite"
          >
            Send magic link
          </button>
        </form>
      )}
    </main>
  );
};

export default Auth;
