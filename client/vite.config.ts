import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite"; // 🌟 MAKE SURE THIS IMPORT IS HERE!

export default defineConfig({
  plugins: [
    TanStackRouterVite(), 
    react(), 
    tailwindcss() // 🌟 MAKE SURE THIS FUNCTION IS CALLED IN PLUGINS!
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 8080,
  },
});