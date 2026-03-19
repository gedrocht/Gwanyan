import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

const coverageReportsDirectoryPath = process.env.VITEST_COVERAGE_DIRECTORY ?? './coverage';

/**
 * The unit test configuration is intentionally strict. Coverage is enabled
 * by default so that local runs and GitHub Actions runs measure the same thing.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
    pool: 'threads',
    fileParallelism: false,
    maxWorkers: 1,
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: coverageReportsDirectoryPath,
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/input/**/*.ts',
        'src/simulation/**/*.ts',
        'src/telemetry/**/*.ts',
        'src/rendering/groundSurfacePattern.ts',
      ],
      exclude: ['src/main.ts'],
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
  },
});
