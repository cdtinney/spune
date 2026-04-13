# Task 8: Code and Documentation Cleanup

## Prerequisites

Task 7 (Docker + deploy) is merged. The app is fully functional and deployed.

## Goal

Polish the codebase: migrate to TypeScript, set up consistent linting/formatting, audit performance, refactor for simplicity, and clean up documentation.

## What to do

### TypeScript Migration
- Add TypeScript to both packages.
- Migrate server code from JS to TS (Express types, route handlers, database queries).
- Migrate client code from JS to TSX (React components, Redux slices, API calls).
- Add `tsconfig.json` to each package and the root.
- Ensure builds and tests still work after migration.

### Linting and Formatting
- Set up ESLint with a modern config (flat config format) across both packages.
- Add Prettier with consistent formatting rules.
- Add a root `.prettierrc` and `.eslintrc` (or `eslint.config.js`).
- Run the formatter across the entire codebase and commit the result.
- Add lint and format scripts to the root `package.json`.
- Add lint checks to the GitHub Actions CI workflow.

### Performance Audit
- Review the Spotify polling interval and API call patterns for unnecessary requests.
- Check for unnecessary re-renders in the React client (e.g., missing memoization, over-fetching).
- Review the album deduplication logic for efficiency.
- Check Docker image size and optimize if bloated (e.g., multi-stage build, .dockerignore).

### Refactor for Simplicity
- Remove any dead code, unused exports, or leftover files from the migration.
- Simplify the folder structure if packages have unnecessary nesting.
- Consolidate configuration files where possible.
- Review whether Redux is still needed or if React context/hooks would be simpler.

### Documentation
- Update the README with current project description, setup instructions, and architecture overview.
- Remove references to Travis CI, Heroku, MongoDB, or other replaced infrastructure.
- Document environment variables and how to obtain Spotify API credentials.
- Add a CONTRIBUTING.md if desired.

## Done when

- All code is TypeScript with no `any` escape hatches (or minimal, justified ones).
- ESLint and Prettier are configured and passing in CI.
- No dead code or unused files remain from the migration.
- README accurately describes the current project.
- All changes are on a feature branch off master, submitted as a PR. Do not merge directly to master.
