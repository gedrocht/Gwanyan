# How Mouse Wind Becomes Physics

Beginners often assume the mouse directly tells the grass what angle to bend to.

That is not what this project does.

Instead, the process is:

1. The pointer is projected onto the ground plane.
2. A short history of pointer positions is stored.
3. The recent movement becomes a velocity estimate.
4. The velocity estimate becomes a wind force.
5. The wind force pushes on a spring simulation.
6. The spring simulation changes the grass blade positions.

This extra work matters because it makes the motion feel physical instead of mechanical.
