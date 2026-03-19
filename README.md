# Gwanyan Interactive Grassland

Gwanyan Interactive Grassland is a WebGPU-first browser application
that renders a large square of dirt and grass, then drives the grass
with a damped spring physics simulation whose wind source comes
directly from the user's mouse position and movement.

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

```bash
npm install
npm run dev
```

Open the local URL, move the mouse across the field, and watch the wind push the grass.

## Quality Commands

```bash
npm run quality
```

This runs:

- formatting checks
- ESLint
- TypeScript typechecking
- unit tests with coverage
- application build
- documentation generation
- wiki validation

## Documentation Layers

- `documentation/site/`: the structured handbook and GitHub Pages site
- `documentation/site/static/api/`: generated API docs from TypeDoc
- `documentation/wiki/`: the separate beginner wiki served by Gollum

## Example Commands

```bash
npm run docs:build
npm run wiki:serve
npm run test:unit
npm run test:end-to-end
```

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
