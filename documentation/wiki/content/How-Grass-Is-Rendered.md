# How Grass Is Rendered

Each blade of grass is represented as a very thin strip made of multiple segments.

Why multiple segments?

Because a single straight quad can only rotate like a stiff cardboard cutout, while multiple segments let the blade bend gradually from the bottom to the top.

The code updates the blade geometry every frame:

- the bottom stays near the root,
- the top receives more displacement,
- and a little extra sway is added so the field never looks perfectly static.

This makes the meadow feel much more alive.
