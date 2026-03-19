# Getting Started

This page is written for someone who wants very explicit instructions.

If you want a faster summary, read `START_HERE.md` in the repository
root. If you want the fully guided handbook version, stay on this page.

## Step 1: Install The Prerequisites

You need these tools before you can run the full project workflow:

- Git
- Node.js 22 or newer
- Python 3.10 or newer
- Docker Desktop, only if you want to run the separate wiki software
  locally

Official download pages:

- Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Node.js: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Python: [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Docker Desktop:
  [https://docs.docker.com/get-started/introduction/get-docker-desktop/](https://docs.docker.com/get-started/introduction/get-docker-desktop/)

To check whether your machine is ready, run:

```powershell
pwsh ./scripts/check-prerequisites.ps1
```

or:

```bash
./scripts/check-prerequisites.sh
```

## Step 2: Install The Project Dependencies

This downloads the Node.js packages used by the project.

```powershell
pwsh ./scripts/install-project-dependencies.ps1
```

or:

```bash
./scripts/install-project-dependencies.sh
```

## Step 3: Run The App

This starts the development server.

```powershell
pwsh ./scripts/run-development-application.ps1
```

or:

```bash
./scripts/run-development-application.sh
```

The terminal will print a local URL. Open that URL in your browser and
move your mouse across the field.

## Step 4: Build Everything

This builds the main app, builds the handbook and API documentation, and
checks that the wiki content is internally consistent.

```powershell
pwsh ./scripts/build-all-artifacts.ps1
```

or:

```bash
./scripts/build-all-artifacts.sh
```

## Step 5: Run All Tests

This runs the unit tests and the end-to-end browser tests.

```powershell
pwsh ./scripts/run-all-tests.ps1
```

or:

```bash
./scripts/run-all-tests.sh
```

## Step 6: Run The Complete Verification Workflow

Use this before you open a pull request or when you want the strongest
local confidence check.

```powershell
pwsh ./scripts/verify-complete-project.ps1
```

or:

```bash
./scripts/verify-complete-project.sh
```

## What The Beginner Scripts Mean

- `check-prerequisites`: checks whether your machine is ready
- `install-project-dependencies`: downloads project packages
- `run-development-application`: starts the local app server
- `build-all-artifacts`: builds the app and documentation
- `run-all-tests`: runs unit and browser tests
- `verify-complete-project`: runs the broadest local verification pass

## Optional Advanced Commands

These commands still exist if you want the lower-level npm entry points:

```bash
npm run dev
npm run build
npm run docs:build
npm run test:unit
npm run test:end-to-end
npm run quality
```
