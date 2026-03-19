# Gwanyan

[![Repo Health](https://github.com/gedrocht/Gwanyan/actions/workflows/repo-health.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/repo-health.yml)
[![Dependency Review](https://github.com/gedrocht/Gwanyan/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/dependency-review.yml)
[![CodeQL](https://github.com/gedrocht/Gwanyan/actions/workflows/codeql.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/codeql.yml)
[![Scorecards](https://github.com/gedrocht/Gwanyan/actions/workflows/scorecards.yml/badge.svg)](https://github.com/gedrocht/Gwanyan/actions/workflows/scorecards.yml)

Gwanyan is a WebGPU-first interactive grassland project with a
security-focused GitHub baseline, strict repository standards, and
beginner-friendly project governance.

## What This Repository Does

- Establishes a hardened GitHub repository foundation.
- Enforces workflow validation, documentation linting, and repository
  policy checks.
- Adds dependency review, secret scanning, CodeQL analysis, and OpenSSF
  Scorecards.
- Documents how to contribute, report security issues, and collaborate
  safely.

## Quick Start

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
