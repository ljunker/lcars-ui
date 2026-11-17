import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'lcars-ui.js',
    },
    rolldownOptions: {
      external: ['lit', 'lit/directives/if-defined.js', 'lit/directives/live.js'],
    },
  },
});
