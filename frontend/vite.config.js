import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "MaizeDx — Maize Leaf Disease Diagnosis",
        short_name: "MaizeDx",
        description: "Diagnose maize leaf diseases from a photo, with bilingual management guidance.",
        theme_color: "#3F6B2B",
        background_color: "#F1F4EC",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Cache the app shell so it opens even with a weak/no connection;
        // /predict itself still needs a live network round trip.
        globPatterns: ["**/*.{js,css,html,svg,png}"],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});
