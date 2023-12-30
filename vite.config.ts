import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import veauryVitePlugins from 'veaury/vite/index.js'
import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    veauryVitePlugins({
      type: 'react',
      // Configuration of @vitejs/plugin-vue
      // vueOptions: {...},
      // Configuration of @vitejs/plugin-react
      // reactOptions: {...}, 
      // Configuration of @vitejs/plugin-vue-jsx
      // vueJsxOptions: {...}
    })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        panel: "/src/panel.html",
      },
      output: {
        strict: false,
      },
    },
    minify: false,
  },
  
});
