#!/usr/bin/env bash
set -euo pipefail

# Force-pushes a branch to `staging`, triggering a staging build & deploy.
#
# Usage:
#   ./scripts/deploy-staging.sh              # deploys current branch
#   ./scripts/deploy-staging.sh my-branch    # deploys named branch

BRANCH="${1:-$(git rev-parse --abbrev-ref HEAD)}"

if [ "$BRANCH" = "staging" ] || [ "$BRANCH" = "main" ]; then
  echo "Refusing to deploy '$BRANCH' to staging."
  exit 1
fi

if ! git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  echo "Error: branch '$BRANCH' does not exist locally."
  exit 1
fi

SHA=$(git rev-parse --short "$BRANCH")
SUBJECT=$(git log -1 --format=%s "$BRANCH")

echo "About to deploy:"
echo "  branch: $BRANCH"
echo "  commit: $SHA — $SUBJECT"
echo "  to:     origin/staging (force-push)"
echo ""
read -r -p "Continue? [y/N] " ANSWER
case "$ANSWER" in
  [yY] | [yY][eE][sS]) ;;
  *)
    echo "Aborted."
    exit 0
    ;;
esac

git push origin "${BRANCH}:staging" --force

echo ""
echo "Pushed. Watch the build:"
echo "  https://github.com/cdtinney/spune/actions"
echo ""
echo "Once Watchtower picks up the new :staging image (~60s after CI succeeds):"
echo "  https://staging.spune.tinney.dev"
