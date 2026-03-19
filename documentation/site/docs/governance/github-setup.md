# GitHub Setup

Some repository protections live in version-controlled files and some live in GitHub repository settings.

## Files Already In This Repository

- GitHub Actions workflows for testing, security scanning, dependency review, pages deployment, and repository policy validation
- CODEOWNERS
- pull request template
- issue templates
- Dependabot configuration

## Settings To Enable In GitHub

1. Protect the `main` branch.
2. Require pull requests before merging.
3. Require approvals and, once `CODEOWNERS` is configured with real owners, require code owner review.
4. Require the status checks from the workflows in `.github/workflows`.
5. Enable GitHub Pages using the custom workflow.
6. Enable Dependabot alerts and secret scanning if available on your plan.

## Suggested Repository Description

Use a description like:

> WebGPU-first interactive grassland simulation with mouse-driven wind physics, strict quality gates, and beginner-focused documentation.
