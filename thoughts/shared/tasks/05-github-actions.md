# Task 5: Replace Travis CI with GitHub Actions

## Prerequisites

Task 4 (Spotify API) is merged. The server should be functional at this point.

## Goal

Set up GitHub Actions CI to replace the dead Travis CI pipeline. Delete `.travis.yml`.

## Context

The existing `.travis.yml` does:
1. Installs Node 11, caches npm
2. Starts a MongoDB service
3. Runs `npm install`, `lerna bootstrap`, `npm run client:build`
4. Runs `npm run server:lint`
5. Runs `npm run test:coveralls` (lerna test coverage across both packages, merged and sent to Coveralls)
6. Runs `npm run server:test:integration` (Puppeteer-based)
7. Deploys to Heroku

After previous tasks, the state is:
- Node 22, npm workspaces (not Lerna)
- PostgreSQL (not MongoDB)
- No Heroku deployment
- Root `package.json` scripts have been updated

## What to do

- Delete `.travis.yml`.
- Create `.github/workflows/ci.yml` that:
  - Triggers on push to master and pull requests.
  - Uses `actions/setup-node@v4` with Node 22 and npm caching.
  - Starts a PostgreSQL service container (instead of MongoDB).
  - Runs install, build, lint, and test steps matching the updated root scripts.
  - If Coveralls is still desired, add the repo token as a secret and run coverage. If not, just run tests.
- Remove any Heroku-related scripts from root `package.json` (e.g., `heroku-postbuild`) if not already removed.
- Remove Coveralls-related dependencies from root `package.json` if coverage reporting is being dropped (`coveralls`, `lcov-result-merger`).
- Consider whether integration tests (Puppeteer) should be included in CI or deferred. If the client hasn't been rebuilt yet (Task 6), they won't work — skip them in the workflow for now and add a TODO comment.

## Done when

- `.travis.yml` is deleted.
- `.github/workflows/ci.yml` exists and runs successfully.
- All Heroku-related scripts are removed.
- Linting and unit tests pass in CI.
- A clean commit on a feature branch.
