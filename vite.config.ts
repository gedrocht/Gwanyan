import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Vite only needs a very small amount of configuration for this project.
 * We define a friendly import alias so that the application code can use
 * readable absolute-style imports instead of deep relative paths.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
