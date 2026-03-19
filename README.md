# Gwanyan

[![Repo Health](https://github.com/gedrocht/Gwanyan/actions/workflows/repo-health.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/repo-health.yml)
[![Dependency Review](https://github.com/gedrocht/Gwanyan/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/dependency-review.yml)
[![CodeQL](https://github.com/gedrocht/Gwanyan/actions/workflows/codeql.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/codeql.yml)
[![Scorecards](https://github.com/gedrocht/Gwanyan/actions/workflows/scorecards.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/scorecards.yml)

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

## What This Repository Does

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

1. Clone the repository.
1. Review [CONTRIBUTING.md](CONTRIBUTING.md) before making changes.
1. Run the repository policy check:

   ```powershell
   pwsh ./scripts/verify_repo_standards.ps1
   ```

## Included GitHub Safeguards

- [Repo Health](https://github.com/gedrocht/Gwanyan/actions/workflows/repo-health.yml)
  validates workflows, lints Markdown, checks repository policy, and
  scans for secrets.
- [Dependency Review](https://github.com/gedrocht/Gwanyan/actions/workflows/dependency-review.yml)
  flags risky dependency changes in pull requests.
- [CodeQL](https://github.com/gedrocht/Gwanyan/actions/workflows/codeql.yml)
  analyzes committed GitHub Actions and JavaScript or TypeScript code
  when those languages are present.
- [Scorecards](https://github.com/gedrocht/Gwanyan/actions/workflows/scorecards.yml)
  monitors open source supply chain health.

## Project Files

- [README.md](README.md): repository overview and quick start.
- [CONTRIBUTING.md](CONTRIBUTING.md): contribution standards and review
  expectations.
- [SECURITY.md](SECURITY.md): private vulnerability reporting guidance.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): collaboration expectations.
- [scripts/verify_repo_standards.ps1](scripts/verify_repo_standards.ps1):
  repository policy validation script used by GitHub Actions.

## Polishing Notes

- Pull request titles are expected to use conventional prefixes such as
  `feat:` and `fix:`.
- Documentation is treated as a first-class quality gate.
- The repository is tuned for strong defaults first, then for expansion
  into application code as the project grows.
