// import { fileURLToPath, URL } from "node:url";

// import { defineConfig } from "vite";
// import vue from "@vitejs/plugin-vue";
// import vueDevTools from "vite-plugin-vue-devtools";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [vue(), vueDevTools()],
//   server: {
//     port: 3000,
//   },
//   resolve: {
//     alias: {
//       "@": fileURLToPath(new URL("./src", import.meta.url)),
//     },
//   },
// });




import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path' // 👈 import path

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',        // check & install updates in bg
      injectRegister: 'auto',            // injects the register code for you
      includeAssets: ['favicon.ico', 'robots.txt'],
      selfDestroying: true,
      manifest: {
        name: 'Score Manage System',
        short_name: 'SMS',
        description: 'Score Manage System',
        start_url: '/',                  // important for scope
        scope: '/',                      // make SW control whole app
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#d7d7d7ff',
        icons: [
          { src: '/image/DIS.png', sizes: '192x192', type: 'image/png' },
          { src: '/image/DIS.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        skipWaiting: true,               // activate new SW immediately
        clientsClaim: true,              // take control of open tabs
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallbackDenylist: [/^\/api\//], // don’t hijack API
        maximumFileSizeToCacheInBytes: 5_000_000, // your 5MB limit
      },
      // Optional: enable in dev to test updates
      // devOptions: { enabled: true }
    }),

  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 👈 add this
    }
  }
})


