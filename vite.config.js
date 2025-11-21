import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'js/Main.js'),
      name: 'IceAdventure',
      fileName: 'game',
      formats: ['es']
    },
    outDir: 'js',
    emptyOutDir: false,
    rollupOptions: {
      external: ['phaser'],
      output: {
        globals: {
          phaser: 'Phaser'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});