import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 部署於 yoyo8787.github.io/KanaLearn，需要指定 base 才能正確載入資源
  base: "/KanaLearn/",
  plugins: [react(), tailwindcss()],
});
