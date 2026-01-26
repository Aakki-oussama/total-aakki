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
