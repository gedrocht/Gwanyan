# Start Here

This file is the beginner-friendly path through the whole project.

If you only read one file before touching the codebase, read this one.

## What You Need First

Install these tools before you try to build or test anything:

- Git: [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Node.js 22 or newer: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
- Python 3.10 or newer:
  [https://www.python.org/downloads/](https://www.python.org/downloads/)
- Docker Desktop, only if you want to run the separate wiki software
  locally:
  [https://docs.docker.com/get-started/introduction/get-docker-desktop/](https://docs.docker.com/get-started/introduction/get-docker-desktop/)

If you are not sure whether your machine is ready, run:

```powershell
pwsh ./scripts/check-prerequisites.ps1
```

or:

```bash
./scripts/check-prerequisites.sh
```

## The Five Most Important Commands

Run these from the repository root.

1. Install the project dependencies:

```powershell
pwsh ./scripts/install-project-dependencies.ps1
```

2. Run the app locally:

```powershell
pwsh ./scripts/run-development-application.ps1
```

3. Build the app, the handbook, and the API docs:

```powershell
pwsh ./scripts/build-all-artifacts.ps1
```

4. Run all automated tests:

```powershell
pwsh ./scripts/run-all-tests.ps1
```

5. Run the complete verification workflow:

```powershell
pwsh ./scripts/verify-complete-project.ps1
```

If you prefer Bash, matching `.sh` scripts exist with the same names.

## What Each Script Does

- `check-prerequisites`: checks for Git, Node.js, Python, and Docker
- `install-project-dependencies`: runs `npm install`
- `run-development-application`: starts the local development server
- `build-all-artifacts`: builds the app, builds the handbook, and
  validates the wiki content
- `run-all-tests`: runs unit tests and browser tests
- `verify-complete-project`: runs formatting checks, linting,
  typechecking, security audit, tests, builds, and wiki validation

## If You Only Want To See The App

This is the shortest path:

```powershell
pwsh ./scripts/check-prerequisites.ps1
pwsh ./scripts/install-project-dependencies.ps1
pwsh ./scripts/run-development-application.ps1
```

When the development server starts, it prints a local URL. Open that URL
in a modern browser and move your mouse over the field.

## If You Want To Check That Everything Works

Use this order:

```powershell
pwsh ./scripts/check-prerequisites.ps1
pwsh ./scripts/install-project-dependencies.ps1
pwsh ./scripts/build-all-artifacts.ps1
pwsh ./scripts/run-all-tests.ps1
pwsh ./scripts/verify-complete-project.ps1
```

## Where To Read Next

- `scripts/README.md` explains every script in the `scripts` folder
- `README.md` gives a shorter project overview
- `documentation/site/docs/tutorials/getting-started.md` explains the
  same workflow in the handbook
- `documentation/wiki/content/Home.md` explains the project slowly for
  complete beginners
