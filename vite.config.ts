
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild' // Cambiado de terser a esbuild para mayor velocidad y menos errores de dependencia
  },
  server: {
    port: 3000
  }
});
