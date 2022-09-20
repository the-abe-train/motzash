import { defineConfig } from "cypress";
import tasks from "./cypress/plugins";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      tasks(on, config);
    },
    baseUrl: "http://localhost:8888",
    chromeWebSecurity: false,
    env: {
      SUPABASE_URL: "https://wnfwbgxynjfiuiasogfj.supabase.co",
      SUPABASE_ANON_KEY:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InduZndiZ3h5bmpmaXVpYXNvZ2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjAzMjY3ODksImV4cCI6MTk3NTkwMjc4OX0.qaIlMOfyqVdFmgW6mtS1KVlQt2Q9jHYVAah-VgkYzKU",
    },
    experimentalStudio: true,
  },
});
