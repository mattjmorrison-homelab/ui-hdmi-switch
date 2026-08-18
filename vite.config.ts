import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'HDMI Switch',
        short_name: 'HDMI Switch',
        description: 'Remote control for the TESmart 5-port HDMI switch.',
        theme_color: '#6d28d9',
        background_color: '#101114',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App-shell only: this is a remote control, so a cached/stale read of
        // "what input is active" would be actively misleading. Never let the
        // service worker intercept calls to the GraphQL API.
        runtimeCaching: [
          {
            urlPattern: ({ url }: { url: URL }) => url.hostname === 'graphql.morrisons.site',
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
});
