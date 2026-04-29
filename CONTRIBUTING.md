# Contributing

## Setup

See the [README](README.md) for full setup. Short version:

```bash
git clone git@github.com:cdtinney/spune.git
cd spune
pnpm install
cp packages/server/.env.example packages/server/.env
# Edit .env with your credentials
pnpm dev
```

## Branch Naming

`task/NN-description`, e.g. `task/15-ai-agent-friendly`.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## PR Process

1. Branch off `main`.
2. Make your changes.
3. Run `./scripts/pre-pr.sh` (formatting, lint, tests, build, type-check for both packages — same as CI).
4. Push and open a PR against `main`. CI must pass; PRs are squash-merged.

Install the pre-commit hook (`./scripts/install-hooks.sh`) to run Prettier and ESLint on staged files before each commit.

## Code Quality

### CSS

- **Use design tokens** — Shared colors, spacing, shadows, z-index layers, and border radius are CSS custom properties in `packages/client/src/index.css` under `:root`. Use `var(--token-name)`, never hardcoded values like `#1db954` or `30px`.
- **Use utility classes** before writing component-specific styles: `.btn-primary`, `.icon-interactive`, `.focus-ring`.
- **Don't redeclare inherited styles** — Page containers inherit `background-color` and `font-family` from `body`.

### Naming

- **Constants** — `SCREAMING_SNAKE_CASE` with units: `TILE_SIZE_PX`, `RESIZE_DEBOUNCE_MS`.
- **Booleans** — Props/interface fields use `is`/`has` prefixes (`isPlaying`, `hasError`); local state uses bare adjectives (`visible`, `open`).
- **Callbacks** — Props use `on` (`onClick`); internal handlers use `handle` (`handleResize`).
- **Action types** — Use the `ActionType` const object in `SpotifyContext.tsx`, not string literals.

### Avoiding Duplication

- **Error extraction** — `errorMessage(error)` from `packages/server/src/utils/errorMessage.ts`.
- **Rate limiters** — `createLimiter(max, message)` in `rateLimiter.ts`.
- **Test mocks** — `mockUseUser()` from `packages/client/src/__tests__/helpers/mockUserContext.ts`.
