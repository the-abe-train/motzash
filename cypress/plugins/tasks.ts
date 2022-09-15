import { createClient, Session } from "@supabase/supabase-js";

type Props = {
  user: string;
  url: string;
  key: string;
};

export async function getUserSession({ user, url, key }: Props) {
  const supabase = createClient(url, key);

  // cache session data for each user name
  const sessions = {} as Record<string, Session | null>;
  // Create a session for the user if it doesn't exist already.
  if (!sessions[user]) {
    const { data } = await supabase.auth.signInWithPassword({
      email: `${user}@example.com`,
      password: "password",
    });

    sessions[user] = data.session;
  }

  return sessions[user];
}
