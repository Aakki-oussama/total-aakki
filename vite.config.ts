import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
          // On isole le moteur PDF (@react-pdf/renderer) dans son propre fichier
          // Car il pèse environ 1.5MB et n'est pas nécessaire au démarrage de l'app.
          if (id.includes('@react-pdf')) {
            return 'pdf-engine';
          }

          // On peut aussi isoler les autres grosses librairies dans un fichier 'vendor'
          // pour profiter du cache du navigateur sur les outils qui ne changent jamais.
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
