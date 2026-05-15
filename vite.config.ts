import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages: CI sets BASE_PATH. Project repo → "/repo-name/"; {owner}.github.io repo → "/".
const base = process.env.BASE_PATH?.trim() || "/";

export default defineConfig({
  base,
  plugins: [react()],
});
