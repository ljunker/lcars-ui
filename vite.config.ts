import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'apps/playground/public',
  resolve: {
    alias: { 'lcars-ui': fileURLToPath(new URL('./src/index.ts', import.meta.url)) },
  },
  build: {
    outDir: 'dist-showcase',
    rolldownOptions: {
      input: {
        dashboard: 'index.html',
        geometry: 'apps/playground/geometry.html',
        vanilla: 'examples/vanilla-html/index.html',
        react: 'examples/react/index.html',
      },
    },
  },
});
