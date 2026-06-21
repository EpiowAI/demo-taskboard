# Repository Agent Instructions

This repository follows the central doctrine in
[SylphxAI/doctrine](https://github.com/SylphxAI/doctrine).

Before changing behavior, read [PROJECT.md](./PROJECT.md) and
[.doctrine/project.json](./.doctrine/project.json). Keep enterprise policy in
doctrine; keep only repo-local app facts here.

Useful validation for app changes:

- `bun run lint`
- `bun test`
- `bun run build`
- `bun run db:generate` for schema changes

Do not add mobile-client-specific behavior, shared scheduling platform
semantics, or customer-specific workflow policy into this demo app. Reusable
scheduling contracts need a dedicated owning package or service before other
projects depend on them.
