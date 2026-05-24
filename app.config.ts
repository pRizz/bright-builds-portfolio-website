import { defineConfig } from "@solidjs/start/config";
import { prerenderRoutes } from "./src/domain/routes";

export default defineConfig({
  server: {
    preset: "static",
    prerender: {
      crawlLinks: false,
      routes: [...prerenderRoutes],
    },
  },
});
