import { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/lib/database.types";

const handler: Handler = async (event, context) => {
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
    const supabaseAnonKey = process.env.SUPABASE_SERVICE_KEY || "";
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    const { user_id } = JSON.parse(event.body || "{}");
    console.log("User ID:", user_id);

    const { data, error } = await supabase.auth.admin.deleteUser(user_id);
    if (!error) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "User deleted successfully" }),
      };
    } else {
      console.log("Supabase error.");
      console.error(error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Server error", details: error }),
      };
    }
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error", details: e }),
    };
  }
};

export { handler };
