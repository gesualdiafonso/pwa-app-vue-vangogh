import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      manifest: {
        name: 'Van Gogh App',
        short_name: 'VGA',
        description: 'Van Gogh, una app que muestra cuál retrato retrata tu alma.',
        lang: 'es',
        display: 'standalone',
        orientation: 'any',
        dir: 'auto',
        theme_color: '#fcfeff',
        background_color: '#ffffff',
        icons: [
          {
            src: '/images/iconos/VanGoghApp512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/images/iconos/VanGoghApp192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
