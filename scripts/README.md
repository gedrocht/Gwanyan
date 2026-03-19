# Scripts Guide

The `scripts` folder is the easiest place to start if you are new to the
project.

Every important project process now has a plainly named script.

## Beginner Workflow

Run these from the repository root in this order:

1. Check prerequisites:

```powershell
pwsh ./scripts/check-prerequisites.ps1
```

1. Install dependencies:

```powershell
pwsh ./scripts/install-project-dependencies.ps1
```

1. Run the local app:

```powershell
pwsh ./scripts/run-development-application.ps1
```

1. Build all major artifacts:

```powershell
pwsh ./scripts/build-all-artifacts.ps1
```

1. Run all tests:

```powershell
pwsh ./scripts/run-all-tests.ps1
```

1. Verify the whole project:

```powershell
pwsh ./scripts/verify-complete-project.ps1
```

Matching Bash scripts exist for each of these commands.

## What Each Script Means

- `check-prerequisites`: checks whether your machine has the tools needed
  for the complete workflow
- `install-project-dependencies`: installs the Node.js packages used by
  the project
- `run-development-application`: starts the development server so you can
  open the app in a browser
- `build.ps1` and `build.sh`: build only the application bundle
- `build-all-artifacts`: builds the application bundle, the handbook, and
  the generated API documentation, then validates the wiki content
- `run-all-tests`: runs unit tests and end-to-end browser tests
- `verify-complete-project`: runs the broadest local verification pass
- `validate_wiki_links.py`: checks internal wiki links
- `verify_repo_standards.ps1`: checks whether the repository contains the
  expected governance and project files

## Which Script Should I Use?

- If you want to see the app, use `run-development-application`.
- If you want a production build, use `build`.
- If you want every buildable artifact, use `build-all-artifacts`.
- If you want automated tests, use `run-all-tests`.
- If you want the strongest local confidence check, use
  `verify-complete-project`.
