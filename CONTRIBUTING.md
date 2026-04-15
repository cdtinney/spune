# Contributing

## Setup

See the [README](README.md) for full setup instructions. In short:

```bash
git clone git@github.com:cdtinney/spune.git
cd spune
pnpm install
cp packages/server/.env.example packages/server/.env
# Edit .env with your credentials
pnpm dev
```

## Branch Naming

Use the format: `task/NN-description`

Examples:

- `task/15-ai-agent-friendly`
- `task/08-typescript-migration`

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add related artist caching
fix: correct session cookie domain in dev
docs: update README setup instructions
refactor: extract album dedup logic
test: add tests for token refresh
chore: update dependencies
```

## PR Process

1. Branch off `master`.
2. Make your changes.
3. Run the full check suite locally:
   ```bash
   ./scripts/pre-pr.sh
   ```
4. Push your branch and open a PR against `master`.
5. CI must pass (format, lint, test, build).
6. PRs are squash-merged.

## Running Checks Locally

The `scripts/pre-pr.sh` script runs the full CI suite:

```bash
./scripts/pre-pr.sh
```

This runs formatting, linting, tests, build, and type-checking for both packages. Run this before pushing to catch issues early.

## Code Quality

### CSS

- **Use design tokens** — Shared colors, spacing, shadows, z-index layers, and border radius are defined as CSS custom properties in `packages/client/src/index.css` under `:root`. Always use `var(--token-name)` instead of hardcoding values like `#1db954` or `30px`.
- **Use utility classes** before writing component-specific styles:
  - `.btn-primary` — Spotify-green button with hover state
  - `.icon-interactive` — Text color with dimmed hover/focus state for icon buttons and links
  - `.focus-ring` — Spotify-green focus-visible outline for keyboard accessibility
- **Don't redeclare inherited styles** — Page containers inherit `background-color` and `font-family` from `body`. Don't repeat them.

### Naming

- **Constants** — `SCREAMING_SNAKE_CASE` with descriptive names and units: `TILE_SIZE_PX`, `RESIZE_DEBOUNCE_MS`, not `BASE` or `300`.
- **Booleans** — Props and interface fields use `is`/`has` prefixes (`isPlaying`, `hasError`). Local component state uses bare adjectives (`visible`, `open`).
- **Callbacks** — Props use `on` prefix (`onClick`, `onLogout`). Internal handlers use `handle` prefix (`handleResize`).
- **Action types** — Use the `ActionType` const object in `SpotifyContext.tsx`, not string literals.

### Avoiding Duplication

- **Error extraction** — Use `errorMessage(error)` from `packages/server/src/utils/errorMessage.ts` instead of inlining `error instanceof Error` checks.
- **Rate limiters** — Use `createLimiter(max, message)` in `rateLimiter.ts` to add new limiters.
- **Test mocks** — Use `mockUseUser()` from `packages/client/src/__tests__/helpers/mockUserContext.ts` instead of repeating the full mock shape. Only pass overrides for what your test cares about.

Individual checks:

```bash
pnpm format:check           # Prettier
pnpm lint                   # ESLint (both packages)
pnpm client:test            # Client tests
pnpm server:test            # Server tests
pnpm client:build           # Client build
pnpm --filter spune-client exec tsc --noEmit  # Client types
pnpm --filter spune-server exec tsc --noEmit  # Server types
```
