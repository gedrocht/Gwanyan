# Rendering Pipeline

## Renderer Strategy

The project uses the Three.js WebGPU entry point so the application can target the modern browser rendering path while still benefiting from Three.js compatibility behavior.

The grass blade geometry is updated on the CPU each frame instead of relying on a custom backend-specific shader pipeline. That choice keeps the scene compatible across WebGPU-capable and fallback-capable environments while making the code easier for beginners to inspect.

## Scene Structure

- A physically shaded ground plane uses procedural textures.
- A sky model and directional light create outdoor lighting.
- Grass blades are represented as many thin vertical strips.
- Each blade belongs to a simulated patch.

## Why CPU Geometry Updates?

A custom grass shader would be more advanced, but it would also hide a lot of the learning material inside shader code. Updating the blade mesh on the CPU keeps the project beginner-readable and allows every motion step to be inspected directly in TypeScript.
