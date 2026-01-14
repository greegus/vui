import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [vue(), dts({ tsconfigPath: "./tsconfig.app.json" })],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      name: "vuiii",
    },

    rollupOptions: {
      external: ["vue", "vue-router"],
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
