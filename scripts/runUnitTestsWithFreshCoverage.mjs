import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Vitest sometimes has trouble clearing a previous coverage directory on this
 * Windows workstation. Writing coverage to a fresh timestamped directory each
 * run avoids that cleanup race while still preserving strict coverage checks.
 */
const coverageBuildsDirectoryPath = resolve(process.cwd(), 'coverage', 'generated-reports');
const latestCoveragePathFilePath = resolve(coverageBuildsDirectoryPath, 'latest-path.txt');
const timestampText = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const coverageOutputDirectoryPath = resolve(
  coverageBuildsDirectoryPath,
  `coverage-${timestampText}`,
);
const vitestCommandPath = resolve(process.cwd(), 'node_modules', 'vitest', 'vitest.mjs');

mkdirSync(coverageBuildsDirectoryPath, { recursive: true });

execFileSync(process.execPath, [vitestCommandPath, 'run', '--coverage'], {
  env: {
    ...process.env,
    VITEST_COVERAGE_DIRECTORY: coverageOutputDirectoryPath,
  },
  stdio: 'inherit',
});

writeFileSync(latestCoveragePathFilePath, coverageOutputDirectoryPath);

const generatedCoverageDirectoryNames = readdirSync(coverageBuildsDirectoryPath, {
  withFileTypes: true,
})
  .filter((directoryEntry) => directoryEntry.isDirectory())
  .map((directoryEntry) => ({
    directoryName: directoryEntry.name,
    directoryPath: resolve(coverageBuildsDirectoryPath, directoryEntry.name),
  }))
  .sort(
    (firstCoverageDirectory, secondCoverageDirectory) =>
      statSync(secondCoverageDirectory.directoryPath).mtimeMs -
      statSync(firstCoverageDirectory.directoryPath).mtimeMs,
  );

for (const oldCoverageDirectory of generatedCoverageDirectoryNames.slice(3)) {
  rmSync(oldCoverageDirectory.directoryPath, {
    force: true,
    recursive: true,
  });
}

console.log(`Coverage report generated at ${coverageOutputDirectoryPath}`);
