import { Component, createSignal, Show } from "solid-js";
import { supabase } from "../util/supabase";
import "../styles/google.css";

const AuthPassword: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const loginWithPassword = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("email", email());
      const { error } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (error) {
        console.error(error);
        throw error;
      }
    } catch (error: any) {
      alert(error.error_description || error.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const { error, data } = await supabase.auth.resetPasswordForEmail(email(), {
      redirectTo: "http://localhost:8888/signInWithPassword",
    });
    if (error) {
      console.error(error);
      throw error;
    }
    console.log(data);
  };

  const updatePassword = async () => {
    const { error, data } = await supabase.auth.updateUser({
      email: email(),
      password: password(),
    });
    console.log(data);
  };

  return (
    <div class="col-span-12 my-6">
      <h1 class="font-header text-2xl mb-1">Sign-in form</h1>
      <p>Sign in with your email below</p>
      <form
        onSubmit={loginWithPassword}
        class="flex flex-col space-y-2 py-4 max-w-md"
      >
        <input
          id="email"
          class="px-2 py-1 flex-grow border border-black max-w-md"
          type="email"
          placeholder="Your email"
          required
          value={email()}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
          id="password"
          class="px-2 py-1 flex-grow border border-black max-w-md"
          type="password"
          required
          value={password()}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <div class="flex justify-around items-center">
          <button
            type="submit"
            class="p-2 border border-black rounded drop-shadow-small 
            w-fit bg-ghost hover:drop-shadow-none transition-all"
            aria-live="polite"
          >
            Sign in
          </button>
        </div>
      </form>
      <button
        onClick={resetPassword}
        class="p-2 border border-black rounded drop-shadow-small 
            w-fit bg-ghost hover:drop-shadow-none transition-all"
      >
        Reset password
      </button>
      <button
        class="p-2 border border-black rounded drop-shadow-small 
                  w-fit bg-ghost hover:drop-shadow-none transition-all"
        onClick={updatePassword}
      >
        Update password
      </button>
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

export default AuthPassword;
