## Summary

<!-- Brief description of what this PR does and why. -->

## Test plan

<!-- How was this tested? -->

## Checklist

- [ ] `./scripts/pre-pr.sh` passes locally
- [ ] Formatting: `pnpm format:check`
- [ ] Linting: `pnpm lint`
- [ ] Client tests: `pnpm client:test`
- [ ] Server tests: `pnpm server:test`
- [ ] Client build: `pnpm client:build`
- [ ] Types: `pnpm --filter spune-client exec tsc --noEmit` and `pnpm --filter spune-server exec tsc --noEmit`
