import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Docusaurus sometimes struggles to clear its previous output directory on
 * Windows because the folder can remain locked for a short time after a
 * prior build. Building into a fresh timestamped directory avoids that race
 * entirely. A small marker file records the latest successful output path so
 * that local scripts and GitHub Actions can find the result.
 */
const documentationSiteBuildsDirectoryPath = resolve(
  process.cwd(),
  'documentation',
  'site',
  'generated-builds',
);
const latestDocumentationSitePathFilePath = resolve(
  documentationSiteBuildsDirectoryPath,
  'latest-path.txt',
);
const timestampText = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
const documentationSiteOutputDirectoryPath = resolve(
  documentationSiteBuildsDirectoryPath,
  `site-${timestampText}`,
);
const docusaurusCommandPath = resolve(
  process.cwd(),
  'node_modules',
  '@docusaurus',
  'core',
  'bin',
  'docusaurus.mjs',
);

mkdirSync(documentationSiteBuildsDirectoryPath, { recursive: true });

execFileSync(
  process.execPath,
  [
    docusaurusCommandPath,
    'build',
    'documentation/site',
    '--out-dir',
    documentationSiteOutputDirectoryPath,
  ],
  {
    env: process.env,
    stdio: 'inherit',
  },
);

writeFileSync(latestDocumentationSitePathFilePath, documentationSiteOutputDirectoryPath);

/**
 * Keep only the newest three generated handbook builds so repeated local
 * builds do not slowly fill the repository with old output directories.
 */
const generatedBuildDirectoryNames = readdirSync(documentationSiteBuildsDirectoryPath, {
  withFileTypes: true,
})
  .filter((directoryEntry) => directoryEntry.isDirectory())
  .map((directoryEntry) => ({
    directoryName: directoryEntry.name,
    directoryPath: resolve(documentationSiteBuildsDirectoryPath, directoryEntry.name),
  }))
  .sort(
    (firstBuildDirectory, secondBuildDirectory) =>
      statSync(secondBuildDirectory.directoryPath).mtimeMs -
      statSync(firstBuildDirectory.directoryPath).mtimeMs,
  );

for (const oldBuildDirectory of generatedBuildDirectoryNames.slice(3)) {
  rmSync(oldBuildDirectory.directoryPath, {
    force: true,
    recursive: true,
  });
}

console.log(`Documentation site generated at ${documentationSiteOutputDirectoryPath}`);
