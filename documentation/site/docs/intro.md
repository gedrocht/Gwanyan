# Beginner Handbook

Welcome to the main documentation handbook for the Gwanyan Interactive Grassland project.

If you are a complete beginner and want the fastest path to a working
app, read
[the getting started guide](./tutorials/getting-started.md) next.

If you are working from the repository root in a terminal, the simplest
beginner path is:

```powershell
pwsh ./scripts/check-prerequisites.ps1
pwsh ./scripts/install-project-dependencies.ps1
pwsh ./scripts/run-development-application.ps1
```

This project has three teaching layers:

1. The beginner wiki, which explains ideas slowly and conversationally.
2. This handbook, which explains the system in a more structured engineering format.
3. The API reference, which is generated from source comments and is meant for detailed implementation lookup.

## What You Are Looking At

The app renders a large square patch of dirt and grass in the browser. The mouse acts like a moving wind emitter:

- The mouse position decides where the gust originates.
- The mouse movement speed decides how strong the gust is.
- A damped spring simulation decides how each patch of grass bends and relaxes.

## How To Read The Codebase

If you are a complete beginner, read these in order:

1. [`tutorials/getting-started.md`](./tutorials/getting-started.md)
1. `documentation/wiki/content/Home.md`
1. `documentation/wiki/content/How-Mouse-Wind-Becomes-Physics.md`
1. `documentation/wiki/content/How-Grass-Is-Rendered.md`
1. [`src/input/PointerWindTracker.ts`](../api/modules/input_PointerWindTracker.html)
1. [`src/simulation/WindFieldModel.ts`](../api/modules/simulation_WindFieldModel.html)
1. [`src/simulation/GrassPatchPhysicsSimulation.ts`](../api/modules/simulation_GrassPatchPhysicsSimulation.html)
1. [`src/application/InteractiveGrasslandExperience.ts`](../api/modules/application_InteractiveGrasslandExperience.html)

## Example Learning Goal

If your goal is "I want to understand why the grass bends when I move my mouse," the shortest path is:

1. Learn how the pointer becomes a world-space point.
2. Learn how that point becomes a wind force.
3. Learn how a wind force updates a spring simulation.
4. Learn how the renderer turns the simulated displacement into visible blade geometry.
