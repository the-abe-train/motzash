import { getUserSession } from "./tasks";

export default (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => {
  on("task", {
    getUserSession,
  });

  return config;
};
