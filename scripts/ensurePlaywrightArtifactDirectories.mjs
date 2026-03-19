import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Playwright writes its HTML report and browser artifacts into directories
 * that are expected to exist by the time the reporter finalizes. On this
 * workstation we observed an intermittent Windows-specific failure where the
 * HTML reporter attempted to create its output directory too late. Creating
 * the directories up front makes the browser-test workflow deterministic for
 * beginners and for automation.
 */
const browserTestArtifactRootDirectoryPath = resolve(process.cwd(), 'test-results');
const playwrightHtmlReportDirectoryPath = resolve(
  browserTestArtifactRootDirectoryPath,
  'playwright-report',
);

mkdirSync(browserTestArtifactRootDirectoryPath, { recursive: true });

if (existsSync(playwrightHtmlReportDirectoryPath)) {
  rmSync(playwrightHtmlReportDirectoryPath, {
    force: true,
    recursive: true,
  });
}

console.log('Playwright artifact directories are ready.');
