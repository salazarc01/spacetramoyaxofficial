
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajustamos la base al nombre del repositorio para que los assets carguen correctamente en GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/spacetramoyaxoff/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
});
