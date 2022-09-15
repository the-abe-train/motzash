import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      injectRegister: "auto",
      strategies: "generateSW",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Motzash",
        short_name: "Motzash",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/mask.svg",
            sizes: "150x150",
            type: "image/svg",
            purpose: "maskable",
          },
        ],
        theme_color: "#FFFF66",
        background_color: "#FCFCCF",
        display: "standalone",
        start_url: ".",
        description:
          "Motzash is your dashboard companion for Jewish holidays. Use Motzash to get time for candle lighting and havdalah for Shabbat and Chag, and plan your Holy days with friends!",
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});
