# Contributing

## Standards

- Keep pull requests small, reviewable, and well-tested.
- Add or update tests for every behavioral change.
- Do not commit secrets, credentials, or generated lockfiles
  unless they are intentionally tracked.
- Prefer secure defaults, explicit typing, and least-privilege access patterns.
- Use self-descriptive identifiers instead of abbreviations.
- Keep comments and documentation beginner-friendly and explicit.

## Pull request checklist

- Code is covered by automated tests where applicable.
- Documentation is updated when behavior or setup changes.
- Security implications were considered.
- Backward compatibility and migration impact were reviewed.
- `npm run quality` was run before opening the pull request.

## Review expectations

- At least one approving review is recommended.
- High-risk changes should receive review from a code owner.
- Pull request titles should follow `feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `build:`, or `chore:`.
