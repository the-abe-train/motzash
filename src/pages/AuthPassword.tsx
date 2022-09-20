import {
  Component,
  createEffect,
  createSignal,
  Show,
  useContext,
} from "solid-js";
import { AuthContext } from "../context/auth2";
import { supabase } from "../util/supabase";

const AuthPassword: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("test@example.com");
  const [password, setPassword] = createSignal("password");

  const user = useContext(AuthContext);

  createEffect(() => {
    console.log("User has changed");
    console.log(user.id);
  });

  const loginWithPassword = async (e: Event) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (error) {
        // if (error.message === "Invalid login credentials") {
        //   const { error } = await supabase.auth.signUp({
        //     email: email(),
        //     password: password(),
        //   });
        // }
        // if (!error) {
        //   return;
        // }
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
          data-cy="email-input"
        />
        <input
          class="px-2 py-1 flex-grow border border-black max-w-md"
          type="password"
          required
          value={password()}
          onChange={(e) => setPassword(e.currentTarget.value)}
          data-cy="password-input"
        />
        <div class="flex justify-around items-center">
          <button
            type="submit"
            disabled={loading()}
            class="p-2 border border-black rounded drop-shadow-small 
            w-fit bg-ghost hover:drop-shadow-none disabled:drop-shadow-none transition-all"
            aria-live="polite"
            data-cy="sign-in-btn"
          >
            Sign in
          </button>
        </div>
      </form>
      <Show when={user.id} fallback={<p>User is not signed in.</p>}>
        <p>User is currently signed-in</p>
        <button
          type="button"
          class="w-max py-1 px-2 border border-black rounded my-6
            bg-ghost drop-shadow-small hover:drop-shadow-none disabled:drop-shadow-none transition-all"
          onClick={() => supabase.auth.signOut()}
          disabled={loading()}
        >
          Sign Out
        </button>
      </Show>
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
