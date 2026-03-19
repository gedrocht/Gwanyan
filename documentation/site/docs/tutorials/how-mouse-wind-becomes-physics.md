# How Mouse Wind Becomes Physics

The user experience looks simple: move the mouse, grass bends.

Under the hood, the system performs four separate steps.

## Step 1: Convert Mouse Position Into A Ground Coordinate

The browser tells us where the pointer is on the screen. That is not enough for physics. We need to know where the pointer would land on the ground plane inside the 3D scene.

The application uses a raycaster:

1. Convert the screen coordinate into normalized device coordinates.
2. Cast a ray from the camera through that screen point.
3. Intersect the ray with the flat ground plane.

That intersection point becomes the wind source origin.

## Step 2: Estimate Mouse Velocity

The simulation does not just care about where the pointer is. It also cares about how fast the pointer is moving. Fast motion should feel like a strong gust.

`PointerWindTracker` stores a short history of samples and calculates a smoothed velocity from the oldest and newest retained samples.

## Step 3: Convert Mouse Velocity Into Wind Force

`WindFieldModel` applies three ideas:

- Nearer patches should be affected more strongly than distant patches.
- Faster pointer movement should create stronger wind.
- Even when the pointer is still, the field should have a subtle ambient breeze.

## Step 4: Update The Spring Simulation

Each patch behaves like a damped spring:

- Wind adds force.
- The spring pulls the patch back toward upright.
- Damping removes excess oscillation so the field eventually settles.

This produces motion that feels elastic instead of robotic.
