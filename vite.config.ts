import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Audio Recorder PWA",
          short_name: "AudioPWA",
          description:
            "Записывай аудио, анализируй и получай отчёт прямо с телефона",
          start_url: "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#ff0000",
          orientation: "portrait",
          icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          ],
        },
      }),
    ],
    server: {
      port: Number(env.VITE_HTTP_PORT),
    },
    preview: {
      port: Number(env.VITE_HTTP_PORT),
    },
  };
});
