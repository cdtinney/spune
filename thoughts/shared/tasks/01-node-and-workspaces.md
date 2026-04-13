# Task 1: Upgrade Node.js + Replace Lerna with npm Workspaces

## Prerequisites

None — this is the first task.

## Goal

Get the project running on Node 22 LTS and replace Lerna with npm workspaces so subsequent tasks can install modern packages.

## Context

- Node.js is pinned to 11.10.1 in `.travis.yml` (EOL June 2019). No `engines` field in any `package.json`.
- Lerna 3 manages the monorepo. `lerna bootstrap` (used in root `package.json` scripts) was removed in Lerna v7.
- The monorepo has two packages: `packages/client` and `packages/server`.

## What to do

- Add `"engines": { "node": ">=22" }` to the root `package.json`.
- Replace Lerna with npm workspaces:
  - Add `"workspaces": ["packages/*"]` to root `package.json`.
  - Remove `lerna` from devDependencies.
  - Delete `lerna.json`.
  - Update root `package.json` scripts: replace `lerna bootstrap` with `npm install` (workspaces install automatically), replace any `lerna exec` or `lerna run` calls with `npm run -w` equivalents.
- Run `npm install` to generate a fresh `package-lock.json` with the workspace structure.
- Verify both packages resolve correctly (`npm ls --workspaces`).
- Do NOT attempt to fix broken dependencies or make the app run yet — just get the workspace structure working. Later tasks handle dependency updates.

## Done when

- `lerna.json` is deleted, `lerna` is removed from dependencies.
- Root `package.json` uses `"workspaces"` and all scripts work without Lerna.
- `npm install` completes without errors on Node 22.
- A clean commit on a feature branch.

## Reference

- [npm workspaces docs](https://docs.npmjs.com/cli/using-npm/workspaces)
