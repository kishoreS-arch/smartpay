import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'logo.png', 'icons.svg'],
      manifest: {
        short_name: "SmartPay",
        name: "SmartPay: Fast & Safe Payments",
        description: "Smart Banking for Normal, Senior, and Visual Impaired users.",
        icons: [
          {
            src: "logo.png",
            sizes: "192x192",
            type: "image/jpeg",
            purpose: "any maskable"
          },
          {
            src: "logo.png",
            sizes: "512x512",
            type: "image/jpeg",
            purpose: "any maskable"
          }
        ],
        start_url: "/?source=pwa",
        display: "standalone",
        theme_color: "#111827",
        background_color: "#000000"
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom']
  }
});
