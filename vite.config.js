import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy all /api requests to your backend
      "/api": {
        target: "http://learnifylms.runasp.net", // your HTTP backend
        changeOrigin: true,
        secure: false, // because backend is HTTP
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
