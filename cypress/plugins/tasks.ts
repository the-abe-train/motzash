import { createClient, Session } from "@supabase/supabase-js";
import { useContext } from "solid-js";
import { AuthContext } from "../../src/context/auth2";

type Props = {
  user: string;
  url: string;
  key: string;
};

export async function getUserSession({ user: username, url, key }: Props) {
  const supabase = createClient(url, key);
  // const contextUser = useContext(AuthContext);

  // cache session data for each user name
  const sessions = {} as Record<string, Session | null>;
  // Create a session for the user if it doesn't exist already.
  if (!sessions[username]) {
    const { data } = await supabase.auth.signInWithPassword({
      email: `${username}@example.com`,
      password: "password",
    });

    sessions[username] = data.session;
  }

  return sessions[username];
}
