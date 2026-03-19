# External Libraries

This page explains which major external libraries are used and why.

## Core Runtime Libraries

- [Three.js](https://threejs.org/) provides the 3D rendering foundation, scene graph, cameras, controls, and the WebGPU renderer entry point.
- [Vite](https://vite.dev/) provides the development server and frontend build pipeline.

## Testing And Quality

- [Vitest](https://vitest.dev/) runs unit tests and coverage checks.
- [Playwright](https://playwright.dev/) runs browser-level end-to-end tests.
- [ESLint](https://eslint.org/) enforces coding rules and static analysis.
- [TypeScript ESLint](https://typescript-eslint.io/) adds type-aware linting for TypeScript.
- [TypeDoc](https://typedoc.org/) generates API documentation from source comments.
- [Docusaurus](https://docusaurus.io/) builds the handbook site that is deployed to GitHub Pages.

## Wiki Layer

- [Gollum](https://github.com/gollum/gollum) serves the separate beginner wiki experience from Markdown pages stored in this repository.

## Why The Library List Is Explicit

One of the project goals is beginner education. That means every external dependency should be easy to research further, so each item above links to its official documentation or project home.
