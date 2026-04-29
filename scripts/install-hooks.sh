#!/usr/bin/env bash
#
# Install the project pre-commit hook into .git/hooks.
# Run once after cloning the repo (or after the hook script changes).
# The hook runs Prettier + ESLint on staged files only.
set -e

HOOK_DIR="$(git rev-parse --git-common-dir)/hooks"
mkdir -p "$HOOK_DIR"

cp scripts/pre-commit "$HOOK_DIR/pre-commit"
chmod +x "$HOOK_DIR/pre-commit"
echo "Installed pre-commit hook to $HOOK_DIR/pre-commit"
