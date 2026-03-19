# Gwanyan Interactive Grassland

Gwanyan Interactive Grassland is a WebGPU-first browser application
that renders a large square of dirt and grass, then drives the grass
with a damped spring physics simulation whose wind source comes
directly from the user's mouse position and movement.

## Start Here

If you are new to the project, read
[START_HERE.md](START_HERE.md) first.

The most beginner-friendly commands live in
[scripts/README.md](scripts/README.md).

The shortest beginner path is:

```powershell
pwsh ./scripts/check-prerequisites.ps1
pwsh ./scripts/install-project-dependencies.ps1
pwsh ./scripts/run-development-application.ps1
```

## What The Project Includes

- A 3D browser experience built with strict TypeScript and Three.js
- A large procedural dirt surface with grass blades that respond to wind
- Mouse-driven localized wind based on both pointer position and pointer velocity
- Verbose comments and generated API documentation for beginners
- A polished handbook site built with Docusaurus for GitHub Pages
- A separate serveable beginner wiki powered by actual wiki software
- Structured client-side logging with an in-page diagnostics overlay and downloadable logs
- Strict GitHub Actions for linting, typechecking, testing, coverage,
  security, dependency review, documentation validation, and repository
  policy enforcement

## Quick Start

```powershell
pwsh ./scripts/check-prerequisites.ps1
pwsh ./scripts/install-project-dependencies.ps1
pwsh ./scripts/run-development-application.ps1
```

Open the local URL, move the mouse across the field, and watch the
wind push the grass.

## Build, Test, And Verify

```powershell
pwsh ./scripts/build-all-artifacts.ps1
pwsh ./scripts/run-all-tests.ps1
pwsh ./scripts/verify-complete-project.ps1
```

These scripts provide the simplest named entry points for the full
workflow.

## Documentation Layers

- `documentation/site/`: the structured handbook and GitHub Pages site
- `documentation/site/static/api/`: generated API docs from TypeDoc
- `documentation/wiki/`: the separate beginner wiki served by Gollum

## Build From The Scripts Directory

If you want script names that are easy to understand, start in the
`scripts` directory and use the matching PowerShell or Bash wrapper for
the task you want.

```powershell
pwsh ./scripts/build.ps1
pwsh ./scripts/build-all-artifacts.ps1
pwsh ./scripts/run-all-tests.ps1
pwsh ./scripts/verify-complete-project.ps1
```

Detailed explanations live in
[scripts/README.md](scripts/README.md).

## External Libraries

The project explicitly documents why each major external library exists
and links to the relevant official documentation in
[documentation/site/docs/reference/external-libraries.md](documentation/site/docs/reference/external-libraries.md).

## GitHub Hardening

The repository contains workflows and policies for:

- linting and formatting
- unit and browser testing
- coverage enforcement
- TypeDoc and Docusaurus build verification
- secret scanning
- dependency review
- CodeQL analysis
- OpenSSF Scorecards
- GitHub Pages deployment
- pull request quality checks

Additional GitHub settings that must be enabled after the repository is
pushed are documented in
[documentation/site/docs/governance/github-setup.md](documentation/site/docs/governance/github-setup.md).
