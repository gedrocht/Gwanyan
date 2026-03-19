# Logging And Observability

The project includes verbose client-side diagnostics because interactive graphics projects are much easier to learn from when users can see what the application is doing.

## Logging Surfaces

- Browser developer tools console
- The in-page diagnostics overlay
- A downloadable JSON snapshot
- A global inspection hook on `window.__GWANYAN_DIAGNOSTICS__`

## Why This Matters

Interactive graphics bugs are often timing-related. When users can inspect logs, frame timing, and the latest system actions, they can report problems with much more context.

## Example

In the browser console:

```js
window.__GWANYAN_DIAGNOSTICS__.getBufferedEntries();
```

This returns the latest structured log entries in memory.
