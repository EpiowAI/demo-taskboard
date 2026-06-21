# Demo Taskboard

`EpiowAI/demo-taskboard` is a Next.js calendar/task-board demo with Hono
OpenAPI routes, Drizzle PostgreSQL persistence, i18n, and a React calendar UI.

## Lifecycle

- State: `active`
- Layer: `application`
- Machine manifest: [`.doctrine/project.json`](./.doctrine/project.json)

## Goals

- Provide the demo web application, calendar UI, and event CRUD API.
- Own the Drizzle event schema, Hono OpenAPI route handlers, Next.js pages,
  i18n routing, and frontend event workflow.
- Keep database migrations, environment configuration, and API/UI behavior
  coherent for the demo deployment.

## Non-Goals

- This repo does not own the mobile calendar client, enterprise doctrine,
  generic scheduling platform semantics, or shared foundation packages.
- This repo does not own customer-specific workflows outside this demo app.

## Boundary

Demo Taskboard owns the web/demo application and `/api/events` event surface.
Other projects should treat it as an application endpoint, not as a shared
library. Reusable scheduling behavior should move to an owning shared package or
service before other products depend on it.

## Public Surfaces

- Web app: `src/app/[locale]/`
- Event API: `src/app/api/[[...route]]/route.ts`
- Database schema: `src/db/schema.ts`
- Environment contract: `.env.example`
- Package scripts: `package.json`

## Delivery

No GitHub Actions workflow is present. Production proof for demo behavior is
Biome check, `bun test`, Next build, Drizzle migration validation, and deployment
readback from the documented hosting environment.
