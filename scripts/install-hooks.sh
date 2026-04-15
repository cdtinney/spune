#!/usr/bin/env bash
set -e

HOOK_DIR="$(git rev-parse --git-common-dir)/hooks"
mkdir -p "$HOOK_DIR"

cp scripts/pre-commit "$HOOK_DIR/pre-commit"
chmod +x "$HOOK_DIR/pre-commit"
echo "Installed pre-commit hook to $HOOK_DIR/pre-commit"
