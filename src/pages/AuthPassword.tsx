import { Component, createSignal, Show } from "solid-js";
import { supabase } from "../util/supabase";

const AuthPassword: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("abe.train@the-abe-train.com");
  const [password, setPassword] = createSignal("penistown");

  const loginWithPassword = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (error) {
        if (error.message === "Invalid login credentials") {
          const { error } = await supabase.auth.signUp({
            email: email(),
            password: password(),
          });
        }
        if (!error) {
          return;
        }
        console.error(error);
        throw error;
      }
      console.error(error);
      throw error;
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
  };

  const updatePassword = async () => {
    const { error, data } = await supabase.auth.updateUser({
      email: email(),
      password: password(),
    });
    if (error) {
      console.error(error);
      throw error;
    }
  };

  const signUp = async () => {
    const { error, data } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    });
    if (error) {
      console.error(error);
      throw error;
    }
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
          class="px-2 py-1 flex-grow border border-black max-w-md"
          type="email"
          placeholder="Your email"
          required
          value={email()}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <input
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
      {/* <button
        onClick={signUp}
        class="p-2 border border-black rounded drop-shadow-small 
            w-fit bg-ghost hover:drop-shadow-none transition-all"
      >
        Sign up
      </button>
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
      </button> */}
    </div>
  );
};

export default AuthPassword;
