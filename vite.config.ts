import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'TOTAL App - Gestion Station',
        short_name: 'TotalApp',
        description: 'Gestion des consommations Gasoil et Avances Clients',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Augmente la limite de warning car le moteur PDF est naturellement lourd (>500kb)
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Optimisation du découpage du code (Code Splitting)
        manualChunks(id) {
          // On regroupe toutes les node_modules dans un fichier 'vendor'
          // pour profiter du cache du navigateur. 
          // Note: On ne sépare plus @react-pdf séparément pour éviter les erreurs d'initialisation circulaire.
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
